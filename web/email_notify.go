package web

import (
	"bytes"
	"html/template"

	"fmt"
	"net/smtp"

	"github.com/jordan-wright/email"
	"github.com/kenota/kommentator"
	"github.com/matcornic/hermes"
)

type EmailConfig struct {
	Server   string
	Port     int
	From     string
	Login    string
	Password string
	Admin    string
}

type emailNotifier struct {
	Cfg    *EmailConfig
	Hermes hermes.Hermes
}

type emailData struct {
	kommentator.Comment
	Url string
}

func (p *emailNotifier) AfterSave(c Ctx, comment kommentator.Comment) error {
	t, err := template.New("notification_body").Parse(`
**{{.Author}}** commented on your [post]({{.Url}}):

{{.Body}}

---
	`)
	if err != nil {
		return err
	}

	buf := bytes.NewBufferString("")

	temp := emailData{
		Comment: comment,
		Url:     c.Request.Header.Get("Referer"),
	}

	err = t.Execute(buf, temp)

	if err != nil {
		return err
	}

	emailContent := hermes.Email{
		Body: hermes.Body{
			Name: "Blogger",
			Intros: []string{
				"You just received a new comment!",
			},
			FreeMarkdown: hermes.Markdown(buf.String()),
		},
	}

	e := email.NewEmail()
	e.From = p.Cfg.From
	e.To = []string{p.Cfg.Admin}
	e.Subject = fmt.Sprintf("New comment from %s to %s", *comment.Author, temp.Url)

	html, err := p.Hermes.GenerateHTML(emailContent)
	if err != nil {
		return err
	}

	e.HTML = []byte(html)
	err = e.Send(fmt.Sprintf("%s:%d", p.Cfg.Server, p.Cfg.Port), smtp.PlainAuth("", p.Cfg.Login, p.Cfg.Password, p.Cfg.Server))

	if err != nil {
		return err
	}

	return nil
}

func NewEmailNotifier(Config *EmailConfig) AfterSaver {
	return &emailNotifier{
		Cfg: Config,
		Hermes: hermes.Hermes{
			Product: hermes.Product{
				Name:      "Binarybuffer blog",
				Link:      "https://binarybuffer.com",
				Copyright: "Brought to you by Kommentator https://github.com/kenota/kommentator",
			},
		},
	}
}
