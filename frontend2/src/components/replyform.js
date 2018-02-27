import {h} from 'hyperapp';
import CONSTANTS from "../../../frontend/src/const";

// Conditionally renders reply form


var blankReply = {
	show: false,
	body: "",
}

export default ({comment, updateReply, sendReply}) => {
	let reply = comment.reply ? comment.reply : blankReply

	if (!reply.show) {
		return null;
	}

	return (
			<div class="reply-form">
				<textarea placeholder="What do you think?"
									oninput={e => e.preventDefault() || updateReply({comment:comment, field: "body", value: e.target.value})}>
					{reply.body || ''}
				</textarea>
				<div
					id={CONSTANTS.RECAPTCHA_CALLBACK +  comment.id}
					class="g-recaptcha"
					data-size="invisible"
					data-callback={CONSTANTS.RECAPTCHA_CALLBACK + comment.id}/>

				<button
					class="bttn-material-flat bttn-sm bttn-primary bttn-no-outline"
					onclick={e => e.preventDefault() || sendReply({comment})}>Send</button>
			</div>)
}
