import CONST from "../const";


const fetchPostCommon = {
	method: 'post',
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	},
	mode: 'cors',
};


const actions = {
	sendReply: ({reply, comment}) => async (state, actions) => {
		let response = await fetch(state.config.server + "api/v1/comment", Object.assign({}, fetchPostCommon, {
			body: JSON.stringify({
				body: reply.body,
				email: state.author.email,
				author: state.author.name,
				uri: state.config.uri,
				parent: typeof comment === 'undefined' ? undefined : comment.id,
				recaptcha: "temp",
			})
		})).then(reply => reply.json())
			.then(newComment => {
				return Object.assign({}, newComment, {replies: [], reply: {}});

			});

		return {}
	},
	updateReply: args => (state, actions) => {

		if (typeof args.comment === 'undefined') { // this is first reply
			let target = Object.assign({}, state.reply);
			target[args.field] = args.value;
			return ({reply: target})
		}

		let map = Object.assign({}, state.replyMap);
		let target;
		if (!(args.comment.id in map)) {
			target = {};
			map[args.comment.id] = target;
		} else {
			target = map[args.comment.id];
		}

		target[args.field] = args.value;
		return {
			replyMap: map,
		}
	},


	toggleReplyForm: comment => (state, actions) => {
		if (typeof comment === "undefined") {
			state.reply.show = !state.reply.show;
			return ({reply: state.reply})
		}
	},

	update: args  => (args),
	loadComments: args => async (state, actions) => {
		let comments = await fetch(args.server + "api/v1/comments?uri=" + encodeURIComponent(args.uri))
			.then(resp => resp.json())
			.then(data => {
				const commentMap = {};


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

				return {
					state: 'loaded',
					list: data.comments,
					map: commentMap,
				}
			});

		actions.update({
			config: {
				server: args.server,
				uri: args.uri,
			},
			list: comments.list,
			map: comments.map,
			state: CONST.STATE.LOADED,
		});
	},
};

export default actions
