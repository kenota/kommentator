import {h} from 'hyperapp';
import CONSTANTS from '../const'


export default ({comment, author, commentActions, settings, authorActions}) => {
	const updater = field => e => {
		return commentActions.replyInput({
			id: comment.id,
			field,
			value: e.target.value,
		})
	};
	return (
		<div class="reply-form">
			<textarea placeholder="What do you think?" oninput={e => e.preventDefault() || commentActions.updateReply({id: comment.id, newText: e.target.value})}>{comment.reply.body}</textarea>
			<input type="text" placeholder="Name" oninput={e => e.preventDefault() || commentActions.author.updateName(e.target.value)} value={author.name}/>
			<input type="text" placeholder="Email (not published)"  oninput={e => e.preventDefault() || commentActions.author.updateEmail(e.target.value)} value={author.email}/>
			<div id={CONSTANTS.RECAPTCHA_CALLBACK +  comment.id} class="g-recaptcha" data-sitekey={settings.recaptchaKey} data-size="invisible" data-callback={CONSTANTS.RECAPTCHA_CALLBACK + comment.id}/>
			<button class="bttn-material-flat bttn-sm bttn-primary bttn-no-outline" onclick={e => e.preventDefault() || commentActions.sendReply({id: comment.id})}>Send</button>
	</div>)
}
