var HOME_BLUE_THEME = (function() {
    var newsSlider = function() {
        if ($(".home-slider").length > 0) {
            var homeTns = tns({
                container: ".home-slider",
                items: 1,
                controls: false,
                autoplayHoverPause: true,
                autoplayButtonOutput: false,
                autoplay: true,
                mouseDrag: true,
                gutter: 0,
                nav: true,
            });
        }
    };
    var initDataBox = function() {
        var listDataBox = $(".list-data");
        var innerDataBox = $(".inner-data-box");
        var dataHeight = listDataBox.outerHeight();
        var heightInit = innerDataBox.outerHeight();
        var wrap = gsap.utils.wrap(0 - heightInit + dataHeight, 0);
        gsap.to(".list-data .item", {
            duration: 10,
            ease: "none",
            y: "-=" + (heightInit - dataHeight),
            modifiers: {
                y: gsap.utils.unitize(wrap),
            },
            repeat: -1,
        });
    };
    return {
        _: function() {
            newsSlider();
            initDataBox();
        },
    };
})();
$(document).ready(function() {
    HOME_BLUE_THEME._();
});