import  {h} from 'hyperapp'

import Comment from './comment'
import ReplyForm from './replyform'

export default ({comments}, actions) => {
	let replyForm = <div></div>;
	if (comments.map['root'] && comments.map['root'].showReplyForm)  {
		replyForm =
			(<div class="root-reply">
				<ReplyForm comment={comments.map['root']} commentActions={actions.comments} author={comments.author} settings={comments.settings}/>
			</div>)
	}
	if (comments.state === 'loading') {
		return (<div>Loading</div>)
	} else {
		return (<div style="width: 100%">
				<a href="" onclick={e => e.preventDefault() || actions.comments.toggleReplyForm({commentId: 'root'})} style="margin-bottom: 10px;">Post comment</a><br/>
				{replyForm}
				<ul style="width: 100%;">

					{comments.list.map(c => {
						return <Comment
							id={c.id}
							comment={c}
							author={comments.author}
							commentActions={actions.comments}
							settings={comments.settings}
						/>
					})}
				</ul>
			</div>
		)
	}
}
