$(function() {
    $('nav .mobile-menu').click(function() {
        $('.mobile-link-block').addClass('show');
    })
    $('.mobile-link-block .close-icon').click(function() {
        $('.mobile-link-block').removeClass('show')
    })
    $('nav .web-user-icon .fa-angle-down').click(function() {
        $('.web-link-block').slideToggle().toggleClass('show');
    })
    $('#event .article .click-block').click(function() {
        console.log($(this));
        $(this).next('.drop-down-content').slideToggle().toggleClass('show');
    })
})