import cookies from '../cookies'
import CONSTANTS from '../const'
import loadjs from 'loadjs'

const emptyReply = {
	body: '',
	email: '',
	author: '',
	recaptcha: null,
};

const fetchPostCommon = {
	method: 'post',
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	},
	mode: 'cors',
};

let react = action => ({map, server}, _, {id}) => {
	if (action !== 'like' && action !== 'dislike') {
		throw new Error("Unknown reaction: ", action)
	}
	return update => {
		fetch(server + "api/v1/" + action, Object.assign({}, fetchPostCommon, {
			body: JSON.stringify({
				id
			})
		})).then( resp => {
			map[id][action+'s']++;
			update({map})
		})
	}
};

export default {
	comments: {
		load: (state, actions) => {
			return update => {
				fetch(state.server + "api/v1/comments?uri=" + encodeURIComponent(state.uri))
					.then(resp => resp.json())
					.then(data => {
						const commentMap = {};

						// Comment with id 'ROOT' is empty 'virtual' comment which allows us to reply to it,
						// effectively replying to the post and creating first comment this way
						commentMap['root'] = {
							id: 'root',
							reply: Object.assign({}, emptyReply),
							replies: [],
						};

						// We need to go through the comments and add empty reply to each of them + put them into the map
						const walk = [data.comments];
						let first = true;
						while (walk.length > 0) {
							for (const c of walk[0]) {
								c.reply = Object.assign({}, emptyReply);
								commentMap[c.id] = c;
								if (c.replies.length > 0) {
									walk.push(c.replies);
								}
							}

							walk.shift();
						}

						update({
							state: 'loaded',
							list: data.comments,
							map: commentMap,
						});
					});
			}
		},
		like: react('like'),
		dislike: react('dislike'),

		sendReply: ({map, list, server, uri, author, recaptchaLoaded}, actions, {id}) => {
			return update => {
				const reply = map[id].reply;

				if (!recaptchaLoaded) {
					let cb = "__recaptcha_loaded";

					window[cb] = function () {
						update({
							recaptchaLoaded: true
						});
						actions.sendReply({id});
						delete window[cb];
					};

					loadjs(['https://www.google.com/recaptcha/api.js?onload=' + cb +'&render=explicit']);
					return
				}



				const sendReply = (recaptcha) => {
					fetch(server + "api/v1/comment", Object.assign({}, fetchPostCommon, {
						body: JSON.stringify({
							body: reply.body,
							email: author.email,
							author: author.name,
							uri: uri,
							parent: id === 'root' ? undefined : id,
							recaptcha: recaptcha,
						})
					})).then(reply => reply.json())
						.then(newComment => {
							let copy = Object.assign({}, newComment, {replies: [], reply: Object.assign({}, emptyReply)});
							map[newComment.id] = copy;
							map[id].replies.push(copy);
							map[id].showReplyForm = false;
							map[id].reply = Object.assign({}, emptyReply);
							update({
								map
							});
							if (id === 'root') {
								list.push(copy);
								update({
									list
								})
							}
						})
				};


				if (reply.recaptcha !== null) {
					grecaptcha.reset(reply.recaptcha);
				} else {
					reply.recaptcha = grecaptcha.render(CONSTANTS.RECAPTCHA_CALLBACK + id);
					window[CONSTANTS.RECAPTCHA_CALLBACK + id] = sendReply;
					update({
						map
					})
				}

				grecaptcha.execute(reply.recaptcha);

			}
		},
		toggleReplyForm: ({map}, actions, {commentId}) => {
			map[commentId].showReplyForm = !map[commentId].showReplyForm;
			return {map};
		},
		replyInput: ({map}, actions, {id, field, value}) => {
			map[id].reply[field] = value;
			return {map}
		},
		updateReply: ({map}, {}, {id, newText}) => {
			map[id].reply.body = newText;
			return {map}
		},
		author: {
			updateName: (author, {}, name) => {
				cookies.set(CONSTANTS.AUTHOR_COOKIE_NAME, Object.assign({}, author, {name}), new Date().getTime() + (1000 * 60 * 60 * 24 * 365 * 10))
				return {name}
			},
			updateEmail: (author, {}, email) => {
				cookies.set(CONSTANTS.AUTHOR_COOKIE_NAME, Object.assign({}, author, {email}), new Date().getTime() + (1000 * 60 * 60 * 24 * 365 * 10))
				return {email}
			},
		}
	},


};
