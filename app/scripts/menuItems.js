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

WOW.App = function() {

    var numberResults = 1,
        googleAPI = {
            url: 'https://ajax.googleapis.com/ajax/services/search/images?v=1.0&rsz=' + numberResults + '&q='
        },
        thumbnailDimensions = {
            w: 150,
            h: 150
        },
        lineBreak = document.createElement('br'),
        $menuItems = $('.addItem');

    function init() {
        parseMenuItemText();
    }

    function parseMenuItemText() {
        var menuItemText;
        $.each($menuItems, function(index, $item) {
            menuItemText = $item.innerHTML;
            console.log(menuItemText, $item);
            makeAPICall(menuItemText, $item);
        });
        //are all requests done processing?
        //might need to make 160 promises
        //initializeMagnificPopup();
    }

    function makeAPICall(queryString, $childNode) {
        //encode query string
        queryString = encodeURI(queryString);
        console.log(queryString);

        console.log(googleAPI.url + queryString);
        $.ajax({
            type: 'GET',
            cache: true,
            dataType: 'jsonp',
            url: googleAPI.url + queryString,
            success: function(response) {
                console.log('success', response);
                processImageResponse(response, $childNode);
            },
            error: function(error) {
                console.log('AJAX error ', error);
            }
        });
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "http://api.example.com/data.json", true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log('success', xhr.responseText);
                    processImageResponse(xhr.responseText, $childNode);
                } else {
                    console.log('Error', xhr.statusText);
                }
            }
            xhr.send();
        }

        function processImageResponse(response, $childNode) {
            var $parentNode = $childNode.parent();

            //iterate through number of results (numberResults)
            //response.responseData.results[0].url;
            $.each(response.responseData.results, function(index, item) {
                if (index === 0) {
                    parentNode.prepend(lineBreak);
                }
                var img = document.createElement('img'),
                    imgSrc = item.url;
                img.width = thumbnailDimensions.w,
                img.height = thumbnailDimensions.h;
                img.className = 'magnificGalleryItem'
                img.src = imgSrc;
                parentNode.prepend(img);
            });
        }

        function initializeMagnificPopup() {

            // //popup modal for img
            // $('img').magnificPopup({
            //     type: 'image',
            //     mainClass: 'mfp-fade',
            //     removalDelay: 160,
            //     preloader: false,
            //     fixedContentPos: false,
            //     closeOnContentClick: false
            // });

            // This will create a single gallery from all elements that have class "gallery-item"
            $('.magnificGalleryItem').magnificPopup({
                type: 'image',
                gallery: {
                    enabled: true
                }
            });
        }

        return {
            init: init
        };

    }();

    setTimeout(function() {
        WOW.App.init();
    }, 100);
