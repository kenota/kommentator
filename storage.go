package kommentator


import (
	"database/sql"
	"errors"
	"fmt"
	"strconv"
	"time"

	"github.com/jmoiron/sqlx"
	"github.com/kenota/kommentator/migrations"
	"github.com/mattes/migrate"
	"github.com/mattes/migrate/database/sqlite3"
	"github.com/mattes/migrate/source"
	"github.com/mattes/migrate/source/go-bindata"

	_ "github.com/mattn/go-sqlite3"
	"sync"
)

// Storage handles storing/retrieving of comments and does not do any access-related checks
type Storage interface {
	// Adds new comment and returns new comment with all storage-related fields populated
	AddComment(thread *Thread, parent *Comment, comment *Comment) (*Comment, error)
	// Delete comment
	DeleteComment(*Comment) (bool, error)
	// Retrieve comment by id
	GetComment(IDType) (*Comment, error)
	// Retrieve thread by uri
	GetThread(string) (*Thread, error)

	// Creates thread
	CreateThread(uri, title string) (*Thread, error)

	// Retrieve comments for thread at specific URI
	GetThreadedComments(uri *string) (*ThreadedComments, error)

	LikeComment(idType IDType) error
	DislikeComment(idType IDType) error
}

// Encodes specified path array to represent materialized path following following following format:
// [X][Y]{1, ...}
// Where:
// x - single character, represents string representation of length of next id as ase base 36 number
// Y - X characters string, which is base 36 representation of id of next node in path
// this structure repeated for required nesting levels

// Panics if length of string representation of any path element is more than 35 characters
func EncodePath(path []IDType) string {
	var (
		result string
		id     IDType
	)

	for _, id = range path {
		result += EncodePathComponent(id)
	}

	return result
}

func EncodePathComponent(id IDType) string {
	var (
		result, encId, encLen string
		encLenSize            int
	)

	encId = strconv.FormatInt(int64(id), 36)
	encLen = strconv.FormatInt(int64(len(encId)), 36)
	encLenSize = len(encLen)
	if encLenSize > 1 {
		panic(fmt.Sprintf("Too long id: %d. EncodedId: %s Length: %d ", id, encId, encLen))
	}

	result += encLen
	result += encId

	return result
}

// sqlWriteFunc is defining a callback which will is allowed to modify sqlite database. Since go-sqlite3 (and sqlite)
// supports only one writer, we need to have a dedicated goroutine doing all updates
type sqlWriteCallback func(func() sqlWriteRes, chan sqlWriteRes)

type sqlWriteRes struct {
	Res interface{}
	Err error
}

type sqliteStorage struct {
	Db *sqlx.DB
	WriteLck *sync.Mutex
}

func copyString(s *string) *string {
	var temp string
	if s == nil {
		return nil
	}

	temp = *s
	return &temp
}

func (s *sqliteStorage) changeLikes(commentId IDType, delta int) error {
	var field string

	s.WriteLck.Lock()
	defer s.WriteLck.Unlock()

	if delta > 0 {
		field = "likes"
	} else {
		field = "dislikes"
		delta = -delta
	}

	res, err := s.Db.Exec(fmt.Sprintf("UPDATE comment SET %s = %s + $1 WHERE id = $2", field, field), delta, commentId)
	if err != nil {
		return err
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return err
	}
	switch affected {
	case 0:
		return errors.New("comment does not exist")
	case 1:
		return nil
	default:
		panic(fmt.Sprintf("Unexpected number of rows updated on limited update: %d", affected))
	}
}

func (s *sqliteStorage) LikeComment(id IDType) error {
	return s.changeLikes(id, 1)
}

func (s *sqliteStorage) DislikeComment(id IDType) error {
	return s.changeLikes(id, -1)
}

func (s *sqliteStorage) DeleteComment(*Comment) (bool, error) {
	panic("not implemented yet")
}

func (s *sqliteStorage) GetComment(id IDType) (*Comment, error) {
	var (
		err error
		res Comment
	)

	err = s.Db.Get(&res, "SELECT * FROM comment WHERE id = $1", id)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &res, nil
}

func (s *sqliteStorage) GetThread(uri string) (*Thread, error) {
	var (
		err    error
		thread Thread
	)

	err = s.Db.Get(&thread, "SELECT * FROM thread WHERE uri = $1", uri)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	return &thread, nil
}

func (s *sqliteStorage) CreateThread(uri, title string) (*Thread, error) {
	var (
		id        int64
		err       error
		newThread = &Thread{
			URI:   uri,
			Title: title,
		}
		res sql.Result
	)

	s.WriteLck.Lock()
	defer s.WriteLck.Unlock()

	res, err = s.Db.NamedExec(`
		INSERT INTO thread (uri, title) VALUES (:uri, :title)
	`, newThread)
	if err != nil {
		return nil, err
	}

	id, err = res.LastInsertId()
	if err != nil {
		return nil, err
	}

	newThread.ID = IDType(id)

	return newThread, nil
}

func (s *sqliteStorage) GetThreadedComments(uri *string) (*ThreadedComments, error) {
	var (
		err    error
		th     Thread
		result ThreadedComments
	)

	err = s.Db.Get(&th, "SELECT * FROM thread WHERE uri = $1", uri)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}

	result.Comments = []Comment{}

	err = s.Db.Select(&result.Comments, "SELECT * FROM comment WHERE tid = $1 ORDER BY path, created", th.ID)
	if err != nil {
		return nil, err
	}

	return &result, nil
}

func (s *sqliteStorage) AddComment(thread *Thread, parent *Comment, comment *Comment) (*Comment, error) {
	var (
		id         int64
		err        error
		tx         *sqlx.Tx
		res        sql.Result
		newComment = Comment{
			ID:         comment.ID,
			Author:     comment.Author,
			Body:       comment.Body,
			Email:      copyString(comment.Email),
			Website:    copyString(comment.Website),
			RemoteAddr: comment.RemoteAddr,
			ThreadID:   thread.ID,
		}
		now          = time.Now()
		loadedParent = &Comment{}
	)

	s.WriteLck.Lock()
	defer s.WriteLck.Unlock()

	newComment.Created = &now
	newComment.Modified = &now

	if comment == nil {
		return nil, errors.New("comment is not passed")
	}

	tx, err = s.Db.Beginx()
	if err != nil {
		return nil, err
	}

	defer func() {
		if err != nil {
			tx.Rollback()
		} else {
			tx.Commit()
		}
	}()

	if parent != nil {
		err = tx.Get(loadedParent, "SELECT * FROM comment WHERE id = $1", parent.ID)
		if err != nil {
			return nil, err
		}
		newComment.Path = parent.Path + EncodePathComponent(parent.ID)
		newComment.Depth = loadedParent.Depth + 1
		newComment.Parent = &parent.ID
	} else {
		newComment.Path = EncodePathComponent(thread.ID)
	}

	res, err = tx.NamedExec(`
		INSERT INTO comment
			(tid, path, body, remote_addr, created, modified, author, email, website, depth, parent)
		VALUES (:tid,:path, :body, :remote_addr, :created, :modified, :author, :email, :website, :depth, :parent)
	`, &newComment)
	if err != nil {
		return nil, err
	}

	id, err = res.LastInsertId()
	if err != nil {
		return nil, err
	}

	newComment.ID = IDType(id)
	return &newComment, nil
}



func openSqliteStorage(dbUrl string) (*sqliteStorage, error) {
	var (
		res = &sqliteStorage{
			WriteLck: &sync.Mutex{},
		}
		err error
	)

	res.Db, err = sqlx.Open("sqlite3", dbUrl)

	if err != nil {
		return nil, err
	}

	err = res.runMigrations()
	if err != nil {
		if err == migrate.ErrNoChange {
			return res, nil
		}
		return nil, err
	}

	return res, nil
}

func (s *sqliteStorage) runMigrations() error {
	var (
		err    error
		assets *bindata.AssetSource
		src    source.Driver
		m      *migrate.Migrate
	)

	assets = bindata.Resource(migrations.AssetNames(), func(name string) ([]byte, error) {
		return migrations.Asset(name)
	})
	src, err = bindata.WithInstance(assets)
	if err != nil {
		return err
	}

	d, err := sqlite3.WithInstance(s.Db.DB, &sqlite3.Config{})
	if err != nil {
		return err
	}

	m, err = migrate.NewWithInstance("go-bindata", src, "sqlite3", d)
	if err != nil {
		return err
	}

	return m.Up()
}

//
func MustOpenSqliteStorage(path string) Storage {
	res, err := openSqliteStorage(fmt.Sprintf("%s?parseTime=true", path))
	if err != nil {
		panic(err)
	}

	return res
}
