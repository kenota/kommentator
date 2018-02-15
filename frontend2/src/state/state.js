import cookies from '../cookies'
import CONSTANTS from '../const'

;

export default {
	num: 0,
	state: CONSTANTS.STATE.UNKNOWN,
	config: {
		server: "initial",
		uri: "",
	},
	list: [],
	map: {},
	author: cookies.get(CONSTANTS.AUTHOR_COOKIE_NAME) || {
		name: '',
		email: ''
	},
	settings: {
		recaptchaKey: '6LfPnjMUAAAAAJDZP70cFhHl_68jbL-GhB2DWn5H',
	},
	recaptchaLoaded: false,
	showReplyForm: false,
	reply: {},
	replyMap: {},
};
