import {h} from 'hyperapp';
import CONSTANTS from "../../../frontend/src/const";

export default ({comment, reply, updateReply, recaptchaKey, sendReply}) => {
	let body = reply.body || '';
	let commentId;

	if (typeof comment === 'undefined') {
		commentId = "root";
	} else {
		commentId = comment.id;
	}

	if (!reply.show) {
		return null;
	}


	return (
			<div class="reply-form">
				<textarea placeholder="What do you think?"
									oninput={e => e.preventDefault() || updateReply({id: reply.id, field: "body", value: e.target.value})}>
					{body}
				</textarea>
				<div
					id={CONSTANTS.RECAPTCHA_CALLBACK +  commentId}
					class="g-recaptcha"
					data-sitekey={recaptchaKey}
					data-size="invisible"
					data-callback={CONSTANTS.RECAPTCHA_CALLBACK + commentId}/>

				<button
					class="bttn-material-flat bttn-sm bttn-primary bttn-no-outline"
					onclick={e => e.preventDefault() || sendReply({comment, reply})}>Send</button>
			</div>)
}
