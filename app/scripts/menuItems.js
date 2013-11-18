// var placeholder = document.createElement('img'),
//     lineBreak = document.createElement('br'),
//     $menuItemParent = $('.addItem').parent();

// placeholder.src = 'http://placehold.it/150x150';

// for (var i = 0, len = 3; i < len; i++) {
//     if (i === 0) {
//         $menuItemParent.prepend(lineBreak);
//     }
//     $menuItemParent.prepend(placeholder);
// }

console.log('init images on wheel content script');

var WOW = {};

WOW.Cache = {};
WOW.App = function() {

    var numberResults = 3,
        googleAPI = {
            url: 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&rsz=' + numberResults + '&q='
        },
        thumbnailDimensions = {
            w: 150,
            h: 150
        },
        $menuItems = $('.addItem'),
        menuId;

    function init() {
        parseMenuId();
        WOW.Cache[menuId] = {};
        //getCache();
        parseMenuItemText();
    }

    /**
     * We will use the menu id as the key for urls in cache
     * http://www.waitersonwheels.com/restaurants/menu/169
     * => menu/169
     */

    function parseMenuId() {
        var url = window.location.href,
            a = document.createElement('a');

        a.href = url;
        menuId = a.pathname.replace('/restaurants/', '');
        console.log(menuId);
    }

    function getCache() {
        chrome.storage.local.get('WOW.Cache', function(items) {
            // Notify that we saved.
            console.log('Settings retrieved' + items);
            WOW.Cache = items;
        });
    }

    function parseMenuItemText() {
        var menuItemText;
        $.each($menuItems, function(index, item) {
            menuItemText = item.innerHTML;
            console.log(menuItemText, item);
            makeAPICall(menuItemText, item);
        });

        //Save our requests in local storage

        //are all requests done processing?
        //might need to make 160 promises
        initializeMagnificPopup();
    }

    function makeAPICall(queryString, childNode) {
        //encode query string
        var encodedQueryString = encodeURI(queryString),
            finalAPIUrl = googleAPI.url + encodedQueryString;
        console.log(finalAPIUrl);

        var xhr = new XMLHttpRequest();
        xhr.open('GET', finalAPIUrl, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    //console.log('success', xhr.responseText);
                    processImageResponse(JSON.parse(xhr.responseText), queryString, childNode);
                } else {
                    console.log('Error', xhr.status);
                }
            }
        };
        xhr.send();
    }

    function processImageResponse(response, queryString, childNode) {
        var $parentNode = $(childNode).parent(),
            menuIdCache = WOW.Cache[menuId];

        //iterate through number of results (numberResults)
        //response.responseData.results[0].url;
        $.each(response.responseData.results, function(index, item) {
            var img = document.createElement('img'),
                a = document.createElement('a'),
                lineBreak = document.createElement('br'),
                imgSrc = item.url;

            if (index === 0) {
                $parentNode.prepend(lineBreak);
                //console.log('prepend line break');
            }

            a.href = imgSrc;
            img.onerror = function() {
                img.onerror = '';
                //img.src = 'http://placehold.it/150x150';
                return true;
            };
            img.onload = function() {
                menuIdCache[queryString] = item.url; //only cache 200 requests
                WOW.Cache[menuId] = menuIdCache;
                console.log('wow cache', WOW.Cache[menuId]);

                img.width = thumbnailDimensions.w,
                img.height = thumbnailDimensions.h;
                img.className = 'magnificGalleryItem';
                $parentNode.prepend($(a).append(img));
            };
            img.src = imgSrc;
        });
    }

    function initializeMagnificPopup() {
        //Create a single gallery for images
        $('#pcon').magnificPopup({
            delegate: 'a',
            type: 'image',
            gallery: {
                enabled: true
            },
            preloader: false,
            fixedContentPos: false,
            closeOnContentClick: true,
            removalDelay: 160,
            mainClass: 'mfp-fade'
        });
    }

    function saveKey(key, value) {
        // Save it using the Chrome extension storage API.
        chrome.storage.local.set({
            key: value
        }, function() {
            // Notify that we saved.
            console.log('Settings saved');
        });
    }

    function getGet(key) {
        chrome.storage.local.get(
            key, function(items) {
                // Notify that we saved.
                console.log('Settings retrieved' + items);
            });
    }

    return {
        init: init
    };

}();

setTimeout(function() {
    WOW.App.init();
}, 100);
