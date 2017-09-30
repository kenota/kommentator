package kommentator

import "time"

type IDType int64

//
// Thread represents an ongoing discussion for specific url. Each comment belongs to thread
type Thread struct {
	ID    IDType `json:"id" db:"id"`       // unique id of the comment
	URI   string `json:"uri" db:"uri"`     // uri for this comment thread
	Title string `json:"title" db:"title"` // title of the comment
}

//
// Comment in the thread
type Comment struct {
	ID         IDType     `json:"id" db:"id"`                     // unique id of the comment
	ThreadID   IDType     `json:"tid" db:"tid"`                   // unique id of the thread this comment belongs to
	Path       string     `json:"path" db:"path"`                 // materialized path of this comment
	Body       string     `json:"body" db:"body"`                 // body of the comment
	RemoteAddr string     `json:"remote_addr" db:"remote_addr"`   // Remote address (IP) of author of this comment
	Likes      int64      `json:"likes" db:"likes"`               // Number of likes this comment received
	Dislikes   int64      `json:"dislikes" db:"dislikes"`         // number of dislikes this comment received
	Created    *time.Time `json:"created" db:"created"`           // when this comment was created
	Modified   *time.Time `json:"modified" db:"modified"`         // when this comment was modified
	Author     *string    `json:"author,omitempty" db:"author"`   // name of author of this comment as left by author
	Email      *string    `json:"email,omitempty" db:"email"`     // email left by author of this comment
	Website    *string    `json:"website,omitempty" db:"website"` // url to website leaved by author if any
	Voters     []byte     `json:"-" db:"voters"`                  // binary representation of remote ip for the voters on the post
}

type ThreadedComments struct {
	Thread
	Comments *[]Comment `json:"comments"`
}
