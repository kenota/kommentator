package kommentator

//go:generate go-bindata -pkg migrations -prefix migrations -o migrations/bindata.go migrations/

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
)

// Storage handles storing/retrieving of comments and does not do any access-related checks
type Storage interface {
	// Adds new comment and returns new comment with all storage-related fields populated
	AddComment(thread *Thread, parent *Comment, comment *Comment) (*Comment, error)
	// Delete comment
	DeleteComment(*Comment) (bool, error)
	// Retrieve comment by id
	GetComment(IDType) (*Comment, error)
	// Retrieve thread by id
	GetThread(IDType) (*Thread, error)

	// Retrieve comments for thread at specific URI
	GetThreadedComments(uri *string) (*ThreadedComments, error)
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

type sqliteStorage struct {
	Db *sqlx.DB
}

func copyString(s *string) *string {
	var temp string
	if s == nil {
		return nil
	}

	temp = *s
	return &temp
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

func (s *sqliteStorage) GetThreadedComments(uri string) (*ThreadedComments, error) {
	var (
		err    error
		th     Thread
		result ThreadedComments
	)

	err = s.Db.Get(&th, "SELECT * FROM thread WHERE uri = $1", uri)
	if err != nil {
		return nil, err
	}

	result.ID = th.ID
	result.Title = th.Title
	result.URI = th.URI
	result.Comments = &[]Comment{}

	err = s.Db.Select(result.Comments, "SELECT * FROM comment WHERE tid = $1 ORDER BY path, created", result.ID)
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
		now = time.Now()
	)

	newComment.Created = &now
	newComment.Modified = &now

	if comment == nil {
		return nil, errors.New("comment is not passed")
	}

	if parent != nil {
		newComment.Path = parent.Path + EncodePathComponent(parent.ID)
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

	res, err = tx.NamedExec(`
		INSERT INTO comment
			(tid, path, body, remote_addr, created, modified, author, email, website)
		VALUES (:tid,:path, :body, :remote_addr, :created, :modified, :author, :email, :website)
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

func OpenSqliteStorage(dbUrl string) (*sqliteStorage, error) {
	var (
		res = &sqliteStorage{}
		err error
	)

	res.Db, err = sqlx.Open("sqlite3", dbUrl)

	if err != nil {
		return nil, err
	}

	err = res.runMigrations()
	if err != nil {
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
//func MustOpenSqliteStorage() Storage {
//
//	return &sqliteStorage{}
//}
