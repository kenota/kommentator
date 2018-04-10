package admin

import (
	"bytes"
	"crypto/rand"
	"log"
	"net/http"

	"github.com/gin-contrib/sessions"
	"github.com/gin-gonic/gin"
)

// cookieKey is 32-byte key for AES-128 encryption
type cookieKey [32]byte

var emptyKey cookieKey

// Options defines options for admin routing group
type Options struct {
	// Login for login as admin
	Login string
	// Password for login as admin
	Password string
	// CookieSecret is used to check validity of cookie. If it is not provided, random value would be generated.
	// In that case user would be required to relogin after server restart.
	CookieSecret string
	// cookieKey specifies the encryption key for the cookie. If provided key is empty, random key will be generated.
	// In that case user would be required to relogin after server restart.
	CookieKey cookieKey
}

// Mount mounts admin functionality under specified route
func Mount(opts Options, group *gin.RouterGroup) {
	if opts.Login == "" || opts.Password == "" {
		panic("admin login and password needs to be specified")
	}

	if opts.CookieSecret == "" {
		randomSecret := make([]byte, 32)
		_, err := rand.Read(randomSecret)
		if err != nil {
			log.Fatalf("error generating random cookie secret: %v", err)
		}
		opts.CookieSecret = string(randomSecret)
	}
	if bytes.Equal(emptyKey[:], opts.CookieKey[:]) {
		var randomKey cookieKey
		_, err := rand.Read(randomKey[:])
		if err != nil {
			log.Fatalf("error generating random cookie encryption key: %v", err)
		}
	}

	store := sessions.NewCookieStore([]byte(opts.CookieSecret), opts.CookieKey[:])
	group.Use(sessions.Sessions("adm_s", store))

	group.GET("login", func(c *gin.Context) {
		session := sessions.Default(c)
		session.Set(isLoggedInKey, true)
		if err := session.Save(); err != nil {
			c.AbortWithError(http.StatusInternalServerError, err)
		}
		c.String(200, "login")
	})

	manage := group.Group("manage")
	manage.Use(onlyLoggedIn)
	manage.GET("list", func(c *gin.Context) {
		c.String(200, "admin list")
	})
}

func disabled(c *gin.Context) {
	c.AbortWithStatusJSON(http.StatusServiceUnavailable, map[string]interface{}{"error": "admin_disabled"})
}

func onlyLoggedIn(c *gin.Context) {
	session := sessions.Default(c)
	isLoggedIn := session.Get(isLoggedInKey)

	if isLoggedIn == nil || isLoggedIn.(bool) != true {
		c.AbortWithStatusJSON(http.StatusForbidden, map[string]interface{}{"error": "not_authenticated"})
		return
	}
}

type authHandler struct {
	Opts Options
}

const isLoggedInKey = "is_logged_in"
