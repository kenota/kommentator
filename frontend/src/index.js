import {app} from 'hyperapp';
import actions from './actions/actions';
import state from './state/state';
import view from './views/CommentList';

for (const i of document.getElementsByClassName("k-comments")) {
    //
	const localState = Object.assign({}, state);


	app(
		localState,
		actions,
		view,
		i
	).load({
		server: i.dataset.kServer,
		uri:i.dataset.kUri,
	})
}
