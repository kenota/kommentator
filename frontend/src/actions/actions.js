import CONST from "../const";
import cookies from "../cookies";
import loadjs from "loadjs";
import {getRecaptchaCallbackName, getRecaptchaDivId} from "../util";

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
		comment.postingReply = true
		actions.setNewState({commentMap: state.commentMap})

		actions.withRecaptchaScript(() => {
			if (typeof comment.recaptcha !== 'undefined') {
				console.log('reseting recaptcha with widget id ', comment.recaptcha)
				grecaptcha.reset(comment.recaptcha)
			}

			const cbId = getRecaptchaCallbackName(comment.id)
			const divId = getRecaptchaDivId(comment.id)

			comment.recaptcha = grecaptcha.render(divId, {
				sitekey: state.settings.recaptcha.sitekey,
				size: 'invisible',
				callback: cbId,
				'error-callback': function(e) {
					console.log("error recaptcha ", e)
				},
				'expired-callback': function(e) {
					console.log('expired-callback', e)
				}
			})
			console.log("loaded new recaptcha widget with id ", comment.recaptcha)
			window[cbId] = async () => {
				delete(window[cbId])
				await actions.postReplyToServer({comment})
				// we need to reload updated comment
				let updated = state.commentMap[comment.id].postingReply = false
				actions.setNewState({commentMap: state.commentMap})
			}

			actions.setNewState({commentMap: state.commentMap})


			grecaptcha.execute(comment.recaptcha)
		})

		return {}
	},

	// postReplyToServer makes actual request to server and assumes that reply has all fields populated and all checks
	// are completed
	postReplyToServer: ({comment}) => async (state, actions) =>  {


		let response =  fetch(state.server + "api/v1/comment", Object.assign({}, fetchPostCommon, {
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

				comment.postingReply = false
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

	// setScriptLoaded makres scriptName as being loaded
	setScriptLoaded: scriptName => (state, actions) => {
		state.loadedScripts[scriptName] = true

		return {loadedScripts: state.loadedScripts}
	},

	// withRecaptchaScript checks if recaptcha script is loaded and then executes func. Note that func can not
	// return new state, but should use another action method to do that
	withRecaptchaScript: func => (state, actions) => {
		if (state.loadedScripts[CONST.RECAPTCHA_SCRIPT_NAME]) {
			console.log("not loading recaptcha")
			setTimeout(func, 0)
		} else {
			console.log("loading recaptcha")
			actions.setNewState({loadingScript: true})
			window[CONST.RECAPTCHA_CALLBACK] = () =>  {
				state.loadedScripts[CONST.RECAPTCHA_SCRIPT_NAME] = true
				actions.setNewState({loadingScript: false, loadedScripts: state.loadedScripts})
				delete window[CONST.RECAPTCHA_CALLBACK]

				func()
			}
			loadjs(["https://www.google.com/recaptcha/api.js?onload=" + CONST.RECAPTCHA_CALLBACK + "&render=explicit"])
		}

		return {}
	},

	// reacts sends reaction to specified comment, currently reaction of 'like' and 'dislike' are only one which are supported
	react: ({comment, reaction}) => async (state, actions) => {
		let path;
		if (typeof comment === 'undefined' || typeof comment.id === 'undefined') {
			console.log("react(): comment or comment id are not present")
			return
		}
		if (reaction === "dislike") {
			path = "dislike"
		} else if (reaction === "like") {
			path = "like"
		} else {
			console.log("unexpected reaction: ", reaction)
			return
		}

		//TODO: error handling
		let res = await fetch(state.server + "api/v1/" + path, Object.assign({}, fetchPostCommon, {
			body: JSON.stringify({
				id: comment.id,
			})
		}))

		state.commentMap[comment.id][path + 's']++
		actions.setNewState({commentMap: state.commentMap})
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
				const commentMap = []
				let list = []

				const visitReplies = (map, comments) => {
					for (const comment of comments) {
						commentMap[comment.id] = comment
					}
				}

				for (const comment of data.comments) {
					commentMap[comment.id] = comment
					list.push(comment.id)

					visitReplies(commentMap, comment.replies)

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
