import cookies from '../cookies'
import CONSTANTS from '../const'

export default {
	comments: {
  	num: 0,
		state: 'loading',
		list: [],
		map: {},
		author : cookies.get(CONSTANTS.AUTHOR_COOKIE_NAME) || {
			name: '',
			email: ''
		},
		settings: {
  		recaptchaKey: '6LfPnjMUAAAAAJDZP70cFhHl_68jbL-GhB2DWn5H',
		},
		recaptchaLoaded: false,
	},

};
