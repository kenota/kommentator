import {h} from 'hyperapp'
import timeago from "timeago.js"

import ReplyForm from './replyform'

const timeFormatter = timeago()

let Comment =  ({comment, toggleReplyForm, updateReply, sendReply, author, updateAuthor, react}) => {
	let children = comment.replies.length === 0 ? <div/> :
		(
			<ul class="children">
				{comment.replies.map(c => { return <Comment comment={c} updateReply={updateReply} sendReply={sendReply} toggleReplyForm={toggleReplyForm} updateAuthor={updateAuthor} author={author} react={react}/> })}
			</ul>
		)
	let replyForm
	if (typeof comment.reply !== 'undefined' && comment.reply.show) {
		replyForm = <ReplyForm comment={comment} updateReply={updateReply} sendReply={sendReply}  updateAuthor={updateAuthor} author={author}/>
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
							<b>{comment.author ? comment.author : 'Anonymous'}</b> • <span class="time">{timeFormatter.format(comment.created)}</span>
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
					<li class="like"><a href="" onclick={e => e.preventDefault() || react({comment: comment, reaction:'like'})}><i class="icon-thumbs-up"/>{comment.likes}</a></li>
					<li class="dislike"><a href="" onclick={e => e.preventDefault() || react({comment: comment, reaction:'dislike'})}><i class="icon-thumbs-down"/>{comment.dislikes}</a></li>
					<li class="reply"><a href="" onclick={e => e.preventDefault() || toggleReplyForm(comment)}>Reply</a></li>
				</ul>

			</div>
			{replyForm}
			{children}
		</li>
	)
}



export default Comment