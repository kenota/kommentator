import cookies from '../cookies'
import CONSTANTS from '../const'

// State represents the state of the comment list
export default {
	// Server specifies the url of the Kommentator server
	server: "initial",
	// Uri specifies the URI of the page to which comments belongs to
	uri: "",
	// Author is used to stre information about current author
	author: cookies.get(CONSTANTS.AUTHOR_COOKIE_NAME) || {
		name: '',
		email: ''
	},
	// State defines current state of the comment list (loaded, error, loading, etc)
	state: CONSTANTS.STATE.UNKNOWN,
	// CommentMap is commentId => comment map of the loaded comments
	commentMap: {},
	// CommentOrderList specifices a list of ids of top-level comments and in the order they need to be displayed
	commentOrderList: [],
	// RootComment is a virtual comment which is used when replying is happening to the post itself, since it does not have any parent
	rootComment: {
		_isRootComment: true,
	},

	// Settings hold system settings
	settings: {
		recaptcha: {
			sitekey: '6LfPnjMUAAAAAJDZP70cFhHl_68jbL-GhB2DWn5H',
		},
	},

	// loadedScripts contains a map of on-demand script names which are already loaded
	loadedScripts: {},
	// loadingScript indicatse if app is currently loading some external script
	loadingScript: false,
};
