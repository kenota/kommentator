package web

import (
	"testing"

	"github.com/kenota/kommentator"
	. "github.com/smartystreets/goconvey/convey"
)

func TestCommentProcessing(t *testing.T) {
	Convey("Given we have comments from db", t, func() {
		parentId := kommentator.IDType(1)
		var comments = kommentator.ThreadedComments{
			Count: 100,
			Comments: []kommentator.Comment{
				kommentator.Comment{
					ID:     1,
					Email:  strToPtr("mail1@mail.com"),
					Author: strToPtr("author1"),
					Body:   "Some awesome comment",
				},
				kommentator.Comment{
					ID:     2,
					Email:  strToPtr("mail2@gmail.com"),
					Author: strToPtr("author2"),
					Body:   "It was, indeed, aweseome",
					Depth:  1,
					Path:   kommentator.EncodePath([]kommentator.IDType{kommentator.IDType(1)}),
					Parent: &parentId,
				},
				kommentator.Comment{
					ID:     3,
					Email:  strToPtr("mail1@gmail.com"),
					Author: strToPtr("author1"),
					Body:   "Forgot to mention this",
				},
				kommentator.Comment{
					ID:     4,
					Email:  strToPtr("mail10@gmail.com"),
					Author: strToPtr("author3"),
					Body:   "I totally agree",
				},
			},
		}

		Convey("Given we executed conversion", func() {
			converted, err := prepareForWeb(comments)
			Convey("There should be no error", func() {
				So(err, ShouldBeNil)
			})
			Convey("There should be data returned", func() {
				So(converted, ShouldNotBeNil)
			})
			Convey("Should have only 3 top level comments", func() {
				So(len(converted.Comments), ShouldEqual, 3)
			})
			Convey("First comment should have one reply", func() {
				So(len(*converted.Comments[0].Replies), ShouldEqual, 1)
			})
			Convey("Second comment should have no replies", func() {
				So(len(*converted.Comments[1].Replies), ShouldEqual, 0)
			})
		})
	})
}
