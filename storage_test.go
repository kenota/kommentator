package kommentator

import (
	"testing"

	"fmt"

	. "github.com/smartystreets/goconvey/convey"
)

func TestEncodePath(t *testing.T) {
	var path []IDType = []IDType{
		1,      // encodes as "1", length is 1, also encodes as "1"
		100,    // encodes as "2S", length is 2, encodes as 2
		99999,  // encodes as "255R", length is 4, encodes as 4
		323445, // encodes as "6XKL", length is 4, encodes as 4
	}

	if EncodePath(path) != "1122s4255r46xkl" {
		t.Fail()
	}

	if EncodePath([]IDType{}) != "" {
		t.Fail()
	}

}

func TestSqliteStorage(t *testing.T) {
	Convey("Given we created sqlite storage", t, func() {
		storage, err := OpenSqliteStorage(":memory:?parseTime=true")
		So(err, ShouldBeNil)
		So(storage, ShouldNotBeNil)
		Convey("Given we created thread", func() {
			t, err := storage.CreateThread("some uri", "some message")
			So(err, ShouldBeNil)
			So(t, ShouldNotBeNil)

			Convey("Id should be filled", func() {
				So(t.ID, ShouldNotEqual, 0)
			})

			Convey("Given we added a comment to thread", func() {
				var (
					author  = "Bill Gates"
					email   = "bill@microsoft.com"
					website = "microsoft.com"
					comment = Comment{
						Author:  &author,
						Body:    "I want to talk with you about investment opportunities",
						Email:   &email,
						Website: &website,
					}
					res *Comment
				)

				res, err = storage.AddComment(t, nil, &comment)
				So(err, ShouldBeNil)
				So(res, ShouldNotBeNil)
				Convey("Comment should have id", func() {
					So(res.ID, ShouldNotEqual, 0)
				})
				Convey("Comment should have thread id set", func() {
					So(res.ThreadID, ShouldNotEqual, 0)
				})
				Convey("Path should be empty", func() {
					So(res.Path, ShouldEqual, "")
				})
				Convey("Should be 0 likes and dislikes", func() {
					So(res.Likes, ShouldBeZeroValue)
					So(res.Dislikes, ShouldBeZeroValue)
				})

				Convey("Given we asked for thread comments", func() {
					var (
						comments *ThreadedComments
					)

					comments, err = storage.GetThreadedComments(t.URI)
					So(err, ShouldBeNil)
					So(comments, ShouldNotBeNil)

					fmt.Printf("Threaded comments: %+v", comments.Comments)
				})

				Convey("Given we added comment as reply of existing comment", func() {
					var (
						author  = "Tim Cook"
						email   = "tim@apple.com"
						website = "Apple.com"
						reply   = Comment{
							Author:  &author,
							Body:    "I think you should be talking to me!",
							Email:   &email,
							Website: &website,
						}
						replyRes *Comment
					)
					replyRes, err = storage.AddComment(t, res, &reply)
					So(err, ShouldBeNil)
					So(replyRes, ShouldNotBeNil)
					Convey("Path of child comment should not be empty", func() {

						So(replyRes.Path, ShouldNotEqual, "")
					})
				})
			})
		})
	})
}
