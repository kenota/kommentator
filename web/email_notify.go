package web

import (
	"bytes"
	"html/template"

	"fmt"
	"net/smtp"

	"log"

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
	Cfg           *EmailConfig
	Hermes        hermes.Hermes
	AdminTemplate *template.Template
	ReplyTemplate *template.Template
}

type emailData struct {
	kommentator.Comment
	Url       string
	Intro     string
	Subject   string
	Recipient string
	Greeting  string
	Template  *template.Template
}

func (p *emailNotifier) sendEmail(data emailData) error {
	log.Println("Sending email to ", data.Recipient)

	buf := bytes.NewBufferString("")
	err := data.Template.Execute(buf, data)

	if err != nil {
		return err
	}

	emailContent := hermes.Email{
		Body: hermes.Body{
			Name: data.Greeting,
			Intros: []string{
				data.Intro,
			},
			FreeMarkdown: hermes.Markdown(buf.String()),
		},
	}

	e := email.NewEmail()
	e.From = p.Cfg.From
	e.To = []string{data.Recipient}
	e.Subject = data.Subject

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

func (p *emailNotifier) AfterSave(c Ctx, comment kommentator.Comment) error {
	authorName := "Other stranger"
	if comment.Author != nil {
		authorName = *comment.Author
	}

	if comment.Parent != nil {
		parent, err := c.Storage.GetComment(*comment.Parent)
		if err == nil && parent.Email != nil {
			recipientName := "Stranger"

			if parent.Author != nil {
				recipientName = *parent.Author
			}

			err = p.sendEmail(emailData{
				Subject:   fmt.Sprintf("%s, %s replied to your comment", recipientName, authorName),
				Recipient: *parent.Email,
				Intro:     "You got reply to your comment",
				Greeting:  recipientName,
				Template:  p.ReplyTemplate,
				Url:       c.Uri,
				Comment:   comment,
			})
			if err != nil {
				log.Printf("Failed to send email to author of parent comment: %v", err)
			}
		} else {
			log.Printf("Failed get parent comment: %v", err)
		}
	}

	err := p.sendEmail(emailData{
		Subject:   fmt.Sprintf("You got new comment"),
		Recipient: p.Cfg.Admin,
		Intro:     "Somebody commented on your post",
		Greeting:  "Admin",
		Template:  p.AdminTemplate,
		Url:       c.Uri,
		Comment:   comment,
	})
	if err != nil {
		return err
	}

	return nil
}

func NewEmailNotifier(Config *EmailConfig) AfterSaver {
	admin, err := template.New("notification_body").Parse(`
**{{.Author}}** commented on your [post]({{.Url}}):

{{.Body}}

---
	`)
	if err != nil {
		panic(err)
	}

	reply, err := template.New("notification_body").Parse(`
**{{.Author}}** replied to your comment in [post]({{.Url}}):

{{.Body}}

---
	`)
	if err != nil {
		panic(err)
	}

	return &emailNotifier{
		Cfg: Config,
		Hermes: hermes.Hermes{
			Product: hermes.Product{
				Name:      "Binarybuffer blog",
				Link:      "https://binarybuffer.com",
				Copyright: "Brought to you by Kommentator https://github.com/kenota/kommentator",
			},
		},
		AdminTemplate: admin,
		ReplyTemplate: reply,
	}
}
