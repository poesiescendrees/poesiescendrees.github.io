$(function() {
    $('.spoiler').each(function() {
        var ths = $(this);

        // inner
        var inner = create('section').addClass('parent-spoiler');
        ths.wrap(inner);
        ths.toggle();

        // name
        var name = ths.attr('name');
        if (name == undefined) name = 'spoiler';
        name += ' :';
        name = createHTML('label', name).addClass('label-spoiler');
        ths.before(name);

        name.click(function() {$(this).closest('.parent-spoiler').find('.spoiler').eq(0).toggle();});
    });
});
