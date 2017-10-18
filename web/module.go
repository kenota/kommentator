package kommentator


// ModuleRes is a result of executing module which can indicate if there was any error and if the error was fatal and
// action should be stopped if possible
type ModuleRes struct {
	Err error
	Fatal bool
}


// PreSaver is executed before comment is saved to storage
type PreSaver interface {
	// PreSave is executed by storage and it also passes pointer to comment and PreSaver can alter/modify data
	// before it is saved
	PreSave(Storage, *Comment) ModuleRes
}

// After saver is piece of code which needs to be executed after comment is saved to storage
type AfterSaver interface {
	AfterSave(Storage, Comment) error
}

