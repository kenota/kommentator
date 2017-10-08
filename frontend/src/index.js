import {app} from 'hyperapp';
import actions from './actions';
import state from './state';
import view from './views/commentlist';

for (const i of document.getElementsByClassName("k-comments")) {

	const localState = Object.assign({}, state);

	localState.comments.uri = i.dataset.kUri;
	localState.comments.server = i.dataset.kServer;

	app({
		state: localState,
		root: i,
		actions,
		view,
	}).comments.load();
}
