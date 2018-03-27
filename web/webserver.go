package web

import (
	"net/http"

	"fmt"
	"log"

	"crypto/md5"
	"encoding/json"

	"time"

	"io/ioutil"
	"net/url"

	"github.com/gin-contrib/cors"
	"github.com/gin-contrib/gzip"
	"github.com/gin-gonic/gin"
	"github.com/kenota/kommentator"

	"github.com/GeertJohan/go.rice"
)

const AFTER_HANDLER_QUEUE_SIZE = 10

func strToPtr(s string) *string {
	return &s
}

// Configuration fo the webserver
type WebApiConfig struct {
	// Array of urls which would be whitelisted on CORS headers
	AuthorizedUrls []string
	// Recaptcha key (optional)
	RecaptchaKey *string
	// Path where database file should be stored
	DbPath string
}

type WebServer interface {
	ListenAndServe(addr string)
	Storage() kommentator.Storage
	AddAfterSaver(AfterSaver)
}

type handlerArgs struct {
	Ctx     Ctx
	Comment kommentator.Comment
}

type webApi struct {
	Config  *WebApiConfig
	storage kommentator.Storage

	afterHandlers []AfterSaver
	afterQueue    chan handlerArgs
}

type newComment struct {
	Uri       string `json:"uri" binding:"required"`
	Body      string `json:"body" binding:"required"`
	Author    string `json:"author"`
	Email     string `json:"email"`
	Parent    *int   `json:"parent"`
	Recaptcha string `json:"recaptcha" binding:"required"`
}

type recaptchaResponse struct {
	Success   bool      `json:"success"`
	Timestamp time.Time `json:"timestamp_ts"`
	Hostname  string    `json:"hostname"`
}

type idAction struct {
	Id int `json: "id"`
}

type WebComment struct {
	ID       int           `json:"id"`
	Uri      string        `json:"uri"`
	Body     string        `json:"body"`
	Author   *string       `json:"author"`
	Email    *string       `json:"email"`
	Replies  *[]WebComment `json:"replies"`
	Created  *time.Time    `json:"created"`
	Modified *time.Time    `json:"modified"`
	Likes    int64         `json:"likes"`
	Dislikes int64         `json:"dislikes"`
}

type WebCommentThread struct {
	Count    int          `json:"count"`
	Comments []WebComment `json:"comments"`
}

func NewWebApi(config *WebApiConfig) (WebServer, error) {
	res := &webApi{
		Config:        config,
		afterHandlers: []AfterSaver{},
		afterQueue:    make(chan handlerArgs, AFTER_HANDLER_QUEUE_SIZE),
	}

	go res.handleAfterSavers()

	return res, nil
}

func (c *webApi) handleAfterSavers() {
	for r := range c.afterQueue {
		for _, m := range c.afterHandlers {
			if err := m.AfterSave(r.Ctx, r.Comment); err != nil {
				log.Printf("Error running after handler for comment: %v", err)
			}
		}
	}
}

func (c *webApi) AddAfterSaver(saver AfterSaver) {
	c.afterHandlers = append(c.afterHandlers, saver)
}

func (c *webApi) Storage() kommentator.Storage {
	return c.storage
}

func (c *WebComment) MarshalJSON() ([]byte, error) {
	type Alias WebComment
	var hash *string
	if c.Email != nil {
		hash = strToPtr(fmt.Sprintf("%x", md5.Sum([]byte(*c.Email))))
	}
	return json.Marshal(&struct {
		Email *string `json:"email"`
		*Alias
	}{
		Email: hash,
		Alias: (*Alias)(c),
	})

}

func prepareForWeb(comments kommentator.ThreadedComments) (*WebCommentThread, error) {
	var (
		res = &WebCommentThread{
			Comments: []WebComment{},
		}
		c      kommentator.Comment
		lookup = map[kommentator.IDType]*[]WebComment{}
		target *[]WebComment
	)

	for _, c = range comments.Comments {
		if c.Parent == nil {
			target = &res.Comments
		} else {
			parent, ok := lookup[*c.Parent]
			if !ok {
				panic("Comment not found")
			}

			target = parent
		}
		*target = append(*target, WebComment{
			Body:     c.Body,
			Email:    c.Email,
			Author:   c.Author,
			Replies:  &[]WebComment{},
			ID:       int(c.ID),
			Created:  c.Created,
			Modified: c.Modified,
			Likes:    c.Likes,
			Dislikes: c.Dislikes,
		})
		lookup[c.ID] = (*target)[len(*target)-1].Replies
	}

	return res, nil
}

func toWebComment(c *kommentator.Comment) *WebComment {
	return &WebComment{
		Body:     c.Body,
		Email:    c.Email,
		Author:   c.Author,
		Replies:  &[]WebComment{},
		ID:       int(c.ID),
		Created:  c.Created,
		Modified: c.Modified,
		Likes:    c.Likes,
		Dislikes: c.Dislikes,
	}
}

func (s *webApi) validateRecaptcha(challenge, ip string) (bool, error) {
	var result recaptchaResponse
	resp, err := http.PostForm("https://www.google.com/recaptcha/api/siteverify",
		url.Values{"secret": {*s.Config.RecaptchaKey}, "remoteip": {ip}, "response": {challenge}})
	if err != nil {
		return false, err
	}
	defer resp.Body.Close()

	data, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return false, err
	}

	log.Println("Response from google: ", string(data))
	err = json.Unmarshal(data, &result)
	if err != nil {
		return false, err
	}

	return result.Success, nil
}

//func (c *gin.Context) {
//	c.Header("Content-Type", "text/javascript")
//	file, err := frontend.Asset("dist/bundle.js")
//	if err != nil {
//		// TODO: error handling
//		c.Status(http.StatusInternalServerError)
//		return
//	}
//	c.String(http.StatusOK, string(file)

func (s *webApi) ListenAndServe(hostport string) {
	var (
		//err    error
		router   *gin.Engine
		storage  kommentator.Storage
		comments *kommentator.ThreadedComments
		err      error
	)

	storage = kommentator.MustOpenSqliteStorage(s.Config.DbPath)
	s.storage = storage

	router = gin.Default()

	config := cors.DefaultConfig()
	config.AllowOrigins = s.Config.AuthorizedUrls
	router.Use(cors.New(config))
	router.Use(gzip.Gzip(gzip.DefaultCompression))

	router.GET("api/v1/comments", func(c *gin.Context) {
		uri := c.Query("uri")

		comments, err = storage.GetThreadedComments(&uri)
		if err != nil {
			c.Status(http.StatusInternalServerError)
		} else {
			if comments == nil {
				comments = &kommentator.ThreadedComments{
					Count:    0,
					Comments: []kommentator.Comment{},
				}
			}

			converted, err := prepareForWeb(*comments)
			if err != nil {
				//TODO: error handling
				c.Status(http.StatusInternalServerError)
				return
			}
			c.JSON(http.StatusOK, converted)
		}
	})
	router.POST("api/v1/like", func(c *gin.Context) {
		var (
			req idAction
		)

		if err := c.Bind(&req); err != nil {
			c.Status(http.StatusBadRequest)
			return
		}
		if err := storage.LikeComment(kommentator.IDType(req.Id)); err != nil {
			c.Status(http.StatusInternalServerError)
			return
		}

		c.Status(http.StatusOK)
	})

	router.POST("api/v1/dislike", func(c *gin.Context) {
		var (
			req idAction
		)

		if err := c.Bind(&req); err != nil {
			c.Status(http.StatusBadRequest)
			return
		}
		if err := storage.DislikeComment(kommentator.IDType(req.Id)); err != nil {
			c.Status(http.StatusInternalServerError)
			return
		}

		c.Status(http.StatusOK)
	})

	router.POST("api/v1/comment", func(c *gin.Context) {
		var (
			req    newComment
			parent *kommentator.Comment
		)
		if err := c.Bind(&req); err != nil {
			c.Status(http.StatusBadRequest)
			return
		}

		if s.Config.RecaptchaKey != nil {
			captchaCheck, err := s.validateRecaptcha(req.Recaptcha, c.ClientIP())
			if err != nil {
				c.Status(http.StatusBadRequest)
				return
			}
			if !captchaCheck {
				c.String(http.StatusForbidden, "Bad captcha response")
				return
			}
		}

		thread, err := storage.GetThread(req.Uri)
		if err != nil {
			// TODO error handling
			c.Status(http.StatusInternalServerError)
			return
		}

		if thread == nil {
			thread, err = storage.CreateThread(req.Uri, "something")
			if err != nil {
				// TODO error handling
				c.Status(http.StatusInternalServerError)
				return
			}
		}

		comment := kommentator.Comment{
			Author: &req.Author,
			Body:   req.Body,
			Email:  &req.Email,
		}

		if req.Parent != nil {
			parent, err = storage.GetComment(kommentator.IDType(*req.Parent))
			if err != nil {
				//TODO error handling
				c.Status(http.StatusInternalServerError)
				return
			}
		}
		log.Printf("Parent: %v", parent)

		reply, err := storage.AddComment(thread, parent, &comment)
		if err != nil {
			// TODO error handling
			c.Status(http.StatusInternalServerError)
			return
		}

		s.afterQueue <- handlerArgs{
			Ctx: Ctx{
				Request: c.Request,
				Uri:     req.Uri,
				Storage: s.storage,
			},
			Comment: *reply,
		}

		c.JSON(http.StatusOK, toWebComment(reply))
	})

	box := rice.MustFindBox("frontend-files")
	router.StaticFS("/dist/", box.HTTPBox())

	router.Run(hostport)

}
