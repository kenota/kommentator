package kommentator

import "errors"

// Config specifying different settings of running instance
type Config struct {
	RequireEmail       bool   // Specifies if email is required for commenting
	MaxThreadDepth     uint8  // Configures maximum allowed thread depth
	ReCaptchaEnabled   bool   // If ReCaptcha is enabled
	ReCaptchaApiKey    string // Key for the ReCaptcha
	ReCaptchaApiSecret string // Secret for ReCaptcha
}

// Client is sending too many requests in short timeframe
var ErrThrottle = errors.New("too frequent requests")
var ErrThreadClosed = errors.New("thread is closed")
var ErrInternal = errors.New("internal error")
var ErrCaptchaFailed = errors.New("incorrect captcha")
