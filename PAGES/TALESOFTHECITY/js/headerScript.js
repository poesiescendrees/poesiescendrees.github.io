$( document ).ready(function() {

    // executes the scroll function if for ex. user refreshes page
    checkAtScroll(0);

    // CODE HERE taken from
    // https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event
    // prevents scroll events from firing at too high rate

    let lastKnownScrollPosition = 0;
    let ticking = false;

    document.addEventListener('scroll', (e) => {
        lastKnownScrollPosition = window.scrollY;

        if (!ticking) {
            window.requestAnimationFrame(() => {
                checkAtScroll(lastKnownScrollPosition);
                ticking = false;
            });

            ticking = true;
        }
    });

    // end of code taken from developer mozilla
});

function checkAtScroll(scrollTop) {
    checkSticked(scrollTop);
}

function checkSticked(windowTop) {
    var stickyEls = $('.sticky');
    var classSticked = 'is-sticked';

    // windowTop : height of current scroll within window
    // var windowTop = $(window).scrollTop();

    stickyEls.each(function() {
        var ths = $(this);

        // height of element within the window
        var currentTop = ths.offset().top;
        // top position set in css file
        var stickedTop = parseFloat(ths.css('top'));

        // checks if sticked :
        // if (element - top position css) is same as current scroll of window
        if ((currentTop - stickedTop) == windowTop) ths.addClass(classSticked);
        else                                        ths.removeClass(classSticked);
    });
}

