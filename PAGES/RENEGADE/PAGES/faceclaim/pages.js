$(function() {
    var bp = $('.choice_filter');
    var crop = $('.crop_filter');
    var uncrop = $('.uncrop_filter');
    var filter = $('.filters_filter');

    var sticked = bp.hasClass('sticky');

    crop.click(function() {
        if (sticked) bp.removeClass('sticky');
        else bp.addClass('sticky');
        sticked = bp.hasClass('sticky');
        /*uncrop.removeClass('none');
        crop.addClass('none');
        filter.addClass('none');*/
    });

    uncrop.click(function() {
        bp.addClass('sticky');
        /*uncrop.addClass('none');
        crop.removeClass('none');
        filter.removeClass('none');*/
    });
});
