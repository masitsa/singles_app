// Initialize app
var myApp = new Framework7({
    swipeBackPage: false,
    pushState: true,
    swipePanel: 'left',
    modalTitle: 'Title'
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

$$('body').on('click', '.js-add-to-fav', function () {
    myApp.alert('You love this post!', '');
});

var mainView = myApp.addView('.view-main', {
    dynamicNavbar: true
});

$$('.popup-splash').on('opened', function () {
    var mySwiper = myApp.swiper('.swiper-container', {
        speed: 400,
        pagination: '.swiper-pagination',
        paginationBulletRender: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + '</span>';
        }
    });
});

$$(document).on('pageInit', function (e) {
    var page = e.detail.page;

    $( '.zoom' ).swipebox();

    if($('.twitter-content').length > 0) {
        $('.twitter-content').twittie({
            count: 10
        });
    }

    if($('.tweet').length > 0) {
        $('.tweet').twittie({
            count: 1
        });
    }

    if($('.flickr-content').length > 0) {
        $('.flickr-content').jflickrfeed({
            limit: 15,
            qstrings: {
                id: '44244432@N03'
            },
            itemTemplate: '<li><a href="{{image_m}}" class="flickr"><img src="{{image_s}}" alt="{{title}}" /></a></li>'
        }, function (data) {
            $('.flickr-content li a').swipebox();
        });
    }

    if ($('.js-validate').length > 0) {
        $('body').on('click', '.js-form-submit', function() {
            var form = $(this).parents('form');
            var valid = form.valid();

            if( page.name === 'contact' && valid){
                var data = form.serializeObject();
                myApp.showPreloader();

                $.post( "/email.php", data)
                  .done(function( data ) {
                        myApp.hidePreloader();
                        var response = JSON.parse(data);

                        if(!response.error) {
                            myApp.alert(response.msg, '');
                            form.find("input[type=text], input[type=email], textarea").val("");;
                        } else {
                            myApp.alert(response.msg, '');
                        }
                  });
            }
        });
    }


    // Conversation flag
    var conversationStarted = false;

// Init Messages
    var myMessages = myApp.messages('.messages', {
        autoLayout:true
    });

// Init Messagebar
    var myMessagebar = myApp.messagebar('.messagebar');

// Handle message
    $$('.messagebar .link').on('click', function () {
        // Message text
        var messageText = myMessagebar.value().trim();
        // Exit if empy message
        if (messageText.length === 0) return;

        // Empty messagebar
        myMessagebar.clear()

        // Random message type
        var messageType = (['sent', 'received'])[Math.round(Math.random())];

        // Avatar and name for received message
        var avatar, name;
        if(messageType === 'received') {
            avatar = 'http://lorempixel.com/output/people-q-c-100-100-9.jpg';
            name = 'Kate';
        }
        // Add message
        myMessages.addMessage({
            // Message text
            text: messageText,
            // Random message type
            type: messageType,
            // Avatar and name:
            avatar: avatar,
            name: name,
            // Day
            day: !conversationStarted ? 'Today' : false,
            time: !conversationStarted ? (new Date()).getHours() + ':' + (new Date()).getMinutes() : false
        })

        // Update conversation flag
        conversationStarted = true;
    });

});

$(document).ready(function() {

    if( localStorage.getItem('newOptions') === null || localStorage.getItem('newOptions') === true ) {
        myApp.popup('.popup-splash');
        localStorage.setItem('newOptions', true);
    }

});


$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
