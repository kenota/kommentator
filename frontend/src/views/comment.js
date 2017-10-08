import {h} from 'hyperapp';
import timeago from 'timeago.js';
import ReplyForm from './replyform';


const t = timeago();
export default function Comment ({comment, author, commentActions, authorActions, settings})  {
	let children = comment.replies.length === 0 ? <div/> :
		(<ul class="children">
			{comment.replies.map(r => {
					return (<Comment id={r.id} comment={r} settings={settings} author={author} commentActions={commentActions} authorActions={authorActions}/>)
				})
			}</ul>);
	let replyForm = comment.showReplyForm ? <ReplyForm comment={comment} settings={settings} author={author} commentActions={commentActions} authorActions={authorActions}/> : <div/>;


	return (

		<li class="comment">
			<div class="avatar">
				<img src={'https://www.gravatar.com/avatar/'+ comment.email + '?s=48'}/>
			</div>
			<div class="comment-body">
				<div class="comment-header">
					<div class="comment-author">
						<b>{comment.author ? comment.author : 'Anonymous'}</b> • <span class="time">{t.format(comment.created)}</span>
					</div>
				</div>
				<p>
					{comment.body}
				</p>
			</div>
			<div class="comment-footer">
				<ul>
					<li class="like"><a href="#" onclick={e => e.preventDefault() || commentActions.like({id: comment.id})}><i class="icon-thumbs-up"/></a>{comment.likes}</li>
					<li class="dislike"><a href="#" onclick={e => e.preventDefault() || commentActions.dislike({id: comment.id})}><i class="icon-thumbs-down"/></a>{comment.dislikes}</li>
					<li class="reply"><a href="#" onclick={e => e.preventDefault() || commentActions.toggleReplyForm({commentId: comment.id})}>Reply</a></li>
				</ul>
			</div>
			{replyForm}
				{children}

		</li>
	)
}
