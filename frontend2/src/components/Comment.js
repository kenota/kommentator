import {h} from 'hyperapp'

import ReplyForm from './replyform'

let Comment =  ({comment, toggleReplyForm, updateReply, sendReply}) => {
	let children = comment.replies.length === 0 ? <div/> :
		(
			<ul class="children">
				{comment.replies.map(c => { return <Comment comment={c} updateReply={updateReply} sendReply={sendReply} toggleReplyForm={toggleReplyForm}/> })}
			</ul>
		)
	let replyForm
	if (typeof comment.reply !== 'undefined' && comment.reply.show) {
		replyForm = <ReplyForm comment={comment} updateReply={updateReply} sendReply={sendReply}/>
	} else {
		replyForm = <div/>
	}

	return (
		<li class="comment">
			<div class="k__avatar">
				<img src={'https://www.gravatar.com/avatar/'+ comment.email + '?s=48'}/>
			</div>
			<div>
				<div class="comment-body">
					<div class="comment-header">
						<div class="comment-author">
							<b>{comment.author ? comment.author : 'Anonymous'}</b> • <span class="time">[TODO: timeago]</span>
						</div>
					</div>
					<p>
						{comment.body}
					</p>
				</div>
			</div>
			{comment.body}
			<div class="comment-footer">
				<ul>
					<li class="like">Like</li>
					<li class="dislike">Dislike</li>
					<li class="reply"><a href="" onclick={e => e.preventDefault() || toggleReplyForm(comment)}>Reply</a></li>
				</ul>

			</div>
			{replyForm}
			{children}
		</li>
	)
}



export default Comment