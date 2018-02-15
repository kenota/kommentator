import {h} from 'hyperapp'

import ReplyForm from '../components/replyform'

export default  (state, actions) => {
	var body;
	console.log(state);

	return (
		<div >
			<a href="" onclick={e => e.preventDefault() || actions.toggleReplyForm()} >Post comment</a><br/>
		<ReplyForm reply={state.reply} updateReply={actions.updateReply} sendReply={actions.sendReply}/>
	</div>)
};
