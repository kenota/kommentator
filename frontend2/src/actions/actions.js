import CONST from "../const";
import cookies from "../cookies";

// fetchPostCommon specifies default settings which are used with every fetch (https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
// post request
const fetchPostCommon = {
	method: 'post',
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	},
	mode: 'cors',
};

function getAuthorCookieExpireTime() {
	return new Date().getTime() + (1000 * 60 * 60 * 24 * 365 * 5)
}

// Actions specifies a HyperApp actions which are responsible for updating the state based on events
// Note that are only allowed modify state if you just return an object with some fields in your action. If you want to do some async work,
// you need to execute another action to update your state
const actions = {
	// sendReply given the comment submits reply to server
	sendReply: ({comment}) => async (state, actions) => {
		let response = await fetch(state.server + "api/v1/comment", Object.assign({}, fetchPostCommon, {
			body: JSON.stringify({
				body: comment.reply.body,
				email: state.author.email,
				author: state.author.name,
				uri: state.uri,
				parent: comment._isRootComment ? undefined : comment.id,
				recaptcha: "temp",
			})
		})).then(reply => reply.json())
			.then(newComment => {
				state.commentMap[newComment.id]  = newComment
				if (comment._isRootComment) {
					state.rootComment.reply = {}
					state.commentOrderList.push(newComment.id)
				} else if (typeof state.commentMap[comment.id] !== 'undefined') {
					state.commentMap[comment.id].replies.push(newComment)
					state.commentMap[comment.id].reply = {}
				}

				actions.setNewState({rootComment: state.rootComment, commentMap: state.commentMap, commentOrderList: state.commentOrderList})
			});

	},


	// Update reply updates one field in the reply for specified comment
	updateReply: ({comment, field, value}) => (state, actions) => {
		if (typeof comment.reply === 'undefined') {
			comment.reply = {}
		}

		comment.reply[field] = value

		if (comment._isRootComment) {
			return {rootComment : comment}
		}

		state.commentMap[comment.id] = comment

		return {commentMap: state.commentMap}
	},

	// updateAuthor updates specific field inside state.author path
	updateAuthor: ({field, value}) => (state, actions) => {
		state.author[field] = value
		cookies.set(CONST.AUTHOR_COOKIE_NAME, state.author, getAuthorCookieExpireTime())
		return {
			author: state.author,
		}
	},

	// ToggleReplyForm toggles display of the reply form for specified comment
	toggleReplyForm: comment => (state, actions) => {
		if (typeof comment.reply === 'undefined') {
			comment.reply = {}
		}
		comment.reply.show = !comment.reply.show
		// We need to update different structures depending if the reply to root comment or to some other comment
		if (comment._isRootComment) {
			return ({
				rootComment: comment,
			})
		}

		state.commentMap[comment.id] = comment
		return ({
			commentMap: state.commentMap,
		})
	},

	// setNewState allows to change any state fields to new values as a per supplied args.
	setNewState: args  => (args),

	// Load is an entry point to application. Once called, app will save server and uri values to local config for future use
	// and loads comments from server
	// TODO: Error handling
	load: ({server, uri}) => async (state, actions) => {
		let comments = await fetch(server + "api/v1/comments?uri=" + encodeURIComponent(uri))
			.then(resp => resp.json())
			.then(data => {
				const commentMap = {};
				let list = [];

				for (const comment of data.comments) {
					commentMap[comment.id] = comment
					list.push(comment.id)
				}

				return {
					state: 'loaded',
					list: list,
					map: commentMap,
				}
			});


		actions.setNewState({
			commentOrderList: comments.list,
			commentMap: comments.map,
			state: CONST.STATE.LOADED,
			server,
			uri
		});
	},

};

export default actions
