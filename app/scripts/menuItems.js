// var placeholder = document.createElement('img'),
// 	lineBreak = document.createElement('br'),
// 	$menuItemParent = $('.addItem').parent();

// placeholder.src = 'http://placehold.it/150x150';

// for (var i = 0, len = 6; i < len; i++) {
// 	if (i === 0) {
// 		$menuItem.prepend(lineBreak);
// 	}
// 	$menuItem.prepend(placeholder);
// }

console.log('init images on wheel content script');


var WOW = {};

WOW.App = function() {

	var numberResults = 6,
    googleAPI = {
        url: 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&rsz=' + numberResults + '&q='
    };

    function init() {
        parseMenuItemText();
    }

    function parseMenuItemText() {
        var $menuItems = $('.addItem'),
            menuItemText;

        $.each($menuItems, function(index, item) {
            menuItemText = item.innerHTML;
            console.log(menuItemText);
            makeAPICall(menuItemText);
        });
    }

    function makeAPICall(queryString) {
        //encode query string
        queryString = encodeURI(queryString);
        console.log(queryString);

        console.log(googleAPI.url + queryString);
        // $.ajax({
        //     type: 'GET',
        //     cache: true,
        //     dataType: 'json',
        //     data: queryString,
        //     url: googleAPI.url,
        //     success: function(response) {
        //         console.log('success', response);
        //     },
        //     error: function(error) {
        //         console.log('AJAX error ', error);
        //     }
        // });
    }

    return {
        init: init
    };
}();

setTimeout(function() {
    WOW.App.init();
}, 100);
