import {h} from 'hyperapp'

import ReplyForm from '../components/replyform'
import Comment from '../components/Comment'

export default  (state, actions) => {
	var body;
	console.log(state);

	return (
		<div style={{width: "100%"}}>
			<a href="" onclick={e => e.preventDefault() || actions.toggleReplyForm()} >Post comment</a><br/>
		<ReplyForm reply={state.reply} updateReply={actions.updateReply} sendReply={actions.sendReply}/>
		<ul>
	{state.list.map(c => { return <Comment comment={c}/> })}
		</ul>
	</div>)
};
