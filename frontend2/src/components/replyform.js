import {h} from 'hyperapp';
import CONSTANTS from "../../../frontend/src/const";
import {getRecaptchaDivId} from "../util"

// Conditionally renders reply form


var blankReply = {
	show: false,
	body: "",
}

export default ({comment, author, updateReply, sendReply, updateAuthor, settings}) => {
	let reply = comment.reply ? comment.reply : blankReply
	let name = author && author.name ? author.name : ""
	let email = author && author.email ? author.email : ""
	const recaptchaDivId = getRecaptchaDivId(comment.id)

	if (!reply.show) {
		return null;
	}

	return (
			<div class="reply-form">
				<textarea placeholder="What do you think?"
									oninput={e => e.preventDefault() || updateReply({comment:comment, field: "body", value: e.target.value})}>
					{reply.body || ''}
				</textarea>
				<input type="text" placeholder="Name" oninput={e => e.preventDefault() || updateAuthor({field: "name", value: e.target.value})} value={name}/>
				<input type="text" placeholder="Email (not published)" oninput={e => e.preventDefault() || updateAuthor({field: "email", value: e.target.value})} value={email}/>
				<div id={recaptchaDivId} class="g-recaptcha" />

				<button
					class="bttn-material-flat bttn-sm bttn-primary bttn-no-outline"
					onclick={e => e.preventDefault() || sendReply({comment})}>Send</button>
			</div>)
}
