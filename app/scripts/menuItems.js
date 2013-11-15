console.log('init images on wheel content script');

var placeholder = document.createElement('img'),
	lineBreak = document.createElement('br'),
	$menuItem = $('.addItem').parent();

placeholder.src = 'http://placehold.it/150x150';

for (var i = 0, len = 6; i < len; i++) {
	if (i === 0) {
		$menuItem.prepend(lineBreak);
	}
	$menuItem.prepend(placeholder);
}