jQuery(document).ready(function($) {

    AOS.init();


    $(".copy").click(function() {
        var _this = $(this);
        var _text = $(this).parent().find(".value");
        navigator.clipboard.writeText(_text.text());
        _this.addClass("copied");
        setTimeout(function() {
            _this.removeClass("copied");
        }, 500);
    });

});

var myPlayer;

jQuery(function() {

    myPlayer = jQuery("#bgndVideo").YTPlayer({

        useOnMobile: true

    });

    myPlayer = jQuery("#bgndVideo2").YTPlayer({

        useOnMobile: true

    });

});

(function() {

    [].slice.call(document.querySelectorAll('.tabs')).forEach(function(el) {

        new CBPFWTabs(el);

    });

})();

jQuery(document).ready(function($) {

    $('.counter').counterUp({

        delay: 10,

        time: 1000

    });

});