package web

import (
	"net/http"

	"github.com/kenota/kommentator"
)

// Res is a result of executing module which can indicate if there was any error and if the error was fatal and
// action should be stopped if possible
type Res struct {
	Err   error
	Fatal bool
}

// Ctx represents the context of module execution. We should not use gin.Context to ensure that we are not tied
// to any particular framework
type Ctx struct {
	Request *http.Request
	Uri     string
	Storage kommentator.Storage
}

// PreSaver is executed before comment is saved to storage
type PreSaver interface {
	// PreSave is executed by storage and it also passes pointer to comment and PreSaver can alter/modify data
	// before it is saved
	PreSave(Ctx, comment *kommentator.Comment) Res
}

// After saver is piece of code which needs to be executed after comment is saved to storage
type AfterSaver interface {
	AfterSave(Ctx, kommentator.Comment) error
}
