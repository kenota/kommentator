import {h} from 'hyperapp'
import ReplyForm from '../components/replyform'
import Comment from '../components/Comment'

// This is top-level component to render main list of comments and top-level reply form
export default  (state, actions) => {
	var body;

	return (
		<div style={{width: "100%"}}>
			<a href="" onclick={e => e.preventDefault() || actions.toggleReplyForm(state.rootComment)} >Post comment</a><br/>
		<ReplyForm comment={state.rootComment} updateReply={actions.updateReply} sendReply={actions.sendReply}/>
		<ul>
		{state.commentOrderList.map(id => { return <Comment comment={state.commentMap[id]} toggleReplyForm={actions.toggleReplyForm} updateReply={actions.updateReply} sendReply={actions.sendReply}/> })}
		</ul>
	</div>)
};
