package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	flags "github.com/jessevdk/go-flags"
	"github.com/kenota/kommentator/web"
)

var opts struct {
	Urls          []string `short:"u" long:"url" description:"urls which allowed to use comment system" env:"URLS"`
	Port          int      `short:"p" long:"port" description:"Port to listen on" default:"1321" env:"PORT"`
	RecaptchaKey  *string  `short:"r" long:"recaptcha" description:"API key for ReCaptcha" env:"RECAPTCHA"`
	Db            string   `short:"d" long:"db" description:"Path to the database file" env:"DB_PATH" default:"./kommentator.db"`
	Version       bool     `short:"v" long:"version" description:"Show version and exit"`
	EmailFrom     string   `long:"email-from" description:"Source email address to use for notifications" env:"EMAIL_FROM"`
	EmailServer   string   `long:"email-server" description:"DNS name of SMTP server used to send email notifications" env:"EMAIL_SERVER"`
	EmailPort     int      `long:"email-port" description:"Port which needs to be used to send email" default:"587" env:"EMAIL_PORT"`
	EmailUser     string   `long:"email-user" description:"Username to use when authenticating on SMTP server" env:"EMAIL_USER"`
	EmailPassword string   `long:"email-password" description:"Password to use for SMTP authentication" env:"EMAIL_PASSWORD"`
	EmailAdmin    string   `long:"email-admin" description:"Email which will receive notifications about new comments" env:"EMAIL_ADMIN"`
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
		log.Fatalln("At least one url need to be specified using -u or --url flag")

	}

	config := &web.WebApiConfig{
		AuthorizedUrls: opts.Urls,
		RecaptchaKey:   opts.RecaptchaKey,
		DbPath:         opts.Db,
	}

	srv, err := web.NewWebApi(config)
	if err != nil {
		log.Fatalln(err)
	}

	if len(opts.EmailServer) > 0 {
		emailNotifier := web.NewEmailNotifier(&web.EmailConfig{
			Server:   opts.EmailServer,
			From:     opts.EmailFrom,
			Port:     opts.EmailPort,
			Login:    opts.EmailUser,
			Password: opts.EmailPassword,
			Admin:    opts.EmailAdmin,
		})
		log.Printf("Enabling email notifications to %s using %s server (login %s) \n",
			opts.EmailAdmin,
			opts.EmailServer,
			opts.EmailUser)

		srv.AddAfterSaver(emailNotifier)
	}

	gin.SetMode(gin.ReleaseMode)
	srv.ListenAndServe(":" + fmt.Sprint(opts.Port))
}
