import {h} from 'hyperapp'

import ReplyForm from './replyform'

export default ({comment}) => {
	let children = comment.replies.length === 0 ? <div/> :
		(
			<ul class="children">
				{comment.replies.map(c => { return <Comment comment={c}/> })}
			</ul>
		)
	let replyForm = comment.showReplyForm ? <ReplyForm comment={comment}/> : <div/>

	return (
		<li class="comment">
			<div class="k__avatar">
				<img src={'https://www.gravatar.com/avatar/'+ comment.email + '?s=48'}/>
			</div>
			<div>
				<div class="comment-body">
					<div class="comment-header">
						<div class="comment-author">
							<b>{comment.author ? comment.author : 'Anonymous'}</b> • <span class="time">1 hour ago</span>
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
					<li class="reply"><a href="" onclick={e => e.preventDefault() || console.log("clicked")}>Reply</a></li>
				</ul>

			</div>
			{replyForm}
			{children}
		</li>
	)
}


