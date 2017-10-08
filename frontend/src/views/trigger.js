import  {h} from 'hyperapp'

import Comment from './comment'
import ReplyForm from './replyform'

export default ({comments, author}, actions) => {


		return (<div style="width: 100%">
				<ReplyForm comment={comments.map['root']} commentActions={actions.comments} author={author}/>;
			</div>
		);
}
