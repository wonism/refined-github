import delegate, {DelegateEvent} from 'delegate-it';
import features from '../libs/features';
import {looseParseInt} from '../libs/utils';

/*
The ajaxed form that loads the new comments points to a URL like:
/_render_node/MDExOlB1bGxSZXF1ZXN0MjE2MDA0MzU5/timeline/more_items?variables%5Bafter%5D=Y3Vyc29yOnYyOpPPAAABZemjg2AAqTQyMjE5MTk1MQ%3D%3D&variables%5Bbefore%5D=Y3Vyc29yOnYyOpPPAAABaENrVHAAqTQ1Mzc3MjMzNg%3D%3D&variables%5Bfirst%5D=60&variables%5BhasFocusedReviewComment%5D=false&variables%5BhasFocusedReviewThread%5D=false
The parameter `variables[first]` controls how many additional comments are fetched. We change this number from 60 to the total number of hidden items to have it load all of them at once.
*/
function handleAltClick(event: DelegateEvent<MouseEvent, HTMLButtonElement>): void {
	if (!event.altKey) {
		return;
	}

	const form = event.delegateTarget.form!;
	const hiddenItemsCount = looseParseInt(form.textContent!);
	const url = new URL(form.action);
	url.searchParams.set('variables[first]', String(hiddenItemsCount));
	form.action = url.href;
}

function init(): void {
	delegate('.ajax-pagination-form button[type="submit"]', 'click', handleAltClick);
}

features.add({
	id: __featureName__,
	description: 'On long discussions where GitHub hides comments under a "Load more...", alt-clicking it will load *all* the comments at once instead of part of them.',
	screenshot: 'https://user-images.githubusercontent.com/1402241/73838332-0c548e00-4846-11ea-935f-28d728b30ae9.png',
	include: [
		features.isIssue,
		features.isPRConversation
	],
	load: features.onAjaxedPages,
	init
});
