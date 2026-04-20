var SLIDER = (function() {
    var newsSlider = function() {
        if ($(".news__slider").length > 0) {
            var news = tns({
                container: '.news__slider',
                items: 4,
                controls: true,
                autoplayHoverPause: true,
                autoplayButtonOutput: false,
                autoplay: true,
                mouseDrag: true,
                gutter: 15,
                controlsText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
                nav: false,
                responsive: {
                    320: {
                        items: 2
                    },
                    900: {
                        items: 4,
                    }
                }
            });
        }

    }
    var fullPartner = function() {
        if ($(".full_partner").length > 0) {
            var partners = $(".full_partner");

            partners.each(function(i, e) {
                var name = "partner_" + i;
                var timeout = i == 0 || i == 2 ? 2000 : 1500;
                var direction = i == 1 ? "backward" : "forward";
                name = tns({
                    container: '.' + name,
                    items: 8,
                    controls: false,
                    autoplay: true,
                    autoplayHoverPause: true,
                    autoplayButtonOutput: false,
                    autoplayDirection: direction,
                    mouseDrag: true,
                    autoplayTimeout: timeout,
                    nav: false,
                    controlsText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
                    responsive: {
                        320: {
                            items: 4,
                            gutter: 20,
                        },
                        768: {
                            items: 6
                        },
                        900: {
                            items: 8,
                            gutter: 20,
                        }
                    }
                });
            });
        }
        if ($(".startup__slider").length > 0) {
            startups = tns({
                container: '.startup__slider',
                items: 2,
                controls: true,
                autoplayHoverPause: true,
                mouseDrag: true,
                loop: true,
                gutter: 15,
                nav: false,
                controlsText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
                responsive: {
                    320: {
                        items: 1.5
                    },
                    900: {
                        items: 2
                    }
                }
            });
        }

    }
    return {
        _: function() {
            newsSlider();
            fullPartner();
        }
    }
})();
$(document).ready(function() {
    SLIDER._();
})