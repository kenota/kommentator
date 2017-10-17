package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	flags "github.com/jessevdk/go-flags"
	"github.com/kenota/kommentator/web"
)

var opts struct {
	Urls         []string `short:"u" long:"url" description:"urls which allowed to use comment system" env:"URLS"`
	Port         int      `short:"p" long:"port" description:"Port to listen on" default:"1321" env:"PORT"`
	RecaptchaKey *string  `short:"r" long:"recaptcha" description:"API key for ReCaptcha" env:"RECAPTCHA"`
	Db           string   `short:"d" long:"db" description:"Path to the database file" env:"DB_PATH" default:"./kommentator.db"`
	Version      bool     `short:"v" long:"version" description:"Show version and exit"`
}

var version string
var commit string

func versionString() string {
	return fmt.Sprintf("Kommentator Version %s build: %s", version, commit)
}

func main() {
	_, err := flags.Parse(&opts)
	if err != nil {
		log.Fatalln("Failed to parse arguments: ", err)
	}
	if opts.Version {
		log.Println(versionString())
		return
	}

	if len(opts.Urls) == 0 {
		log.Fatalln("At least one url need to be specified sing -u or --url flag")

	}

	srv, err := web.NewWebApi(&web.WebApiConfig{
		AuthorizedUrls: opts.Urls,
		RecaptchaKey:   opts.RecaptchaKey,
		DbPath:         opts.Db,
	})
	if err != nil {
		log.Fatalln(err)
	}

	gin.SetMode(gin.ReleaseMode)
	srv.ListenAndServe(":" + fmt.Sprint(opts.Port))
}
