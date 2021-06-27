$(setBasicClasses());

$(setAddBefore());
$(setVariables('vr'));

function setBasicClasses() {
    $('.table_js').wrapInner('<table><tr><td></table></tr></td>');
    $('.scroll_js').wrapInner('<scroll></scroll>');
}

/*
    <container class="addBefore" target="elem" toAdd="<span>—</span>">
        some text
        <p>some text <elem>targeted text</elem> some text</p>

        <elem>targeted text 2</elem>
        <elem>targeted text 3</elem>
    </container>

    BECOMES ::
        <container class="addBefore" target="elem" toAdd="-">
            some text
            <p>some text -<elem>targeted text</elem> some text</p>

            -<elem>targeted text 2</elem>
            -<elem>targeted text 3</elem>
        </container>

    NOTE :: use "addBefore-true" if you don't want toAdd to be inserted
            before the first target element
            example:
                <div class="addBefore-true" target="a" toAdd="<br>">
                    <a>link</a>
                    <a>link</a>
                    <a>link</a>
                </div>
            BECOMES ::
                <div class="addBefore-true" target="a" toAdd="<br>">
                    <a>link</a>
                    <br><a>link</a>
                    <br><a>link</a>
                </div>
*/
function setAddBefore() {
    $('[class^="addBefore"]').each(function() {
        var ths = $(this);
        var classe = ths.attr('class').split('-');
        if (classe.length == 2) {
            var useCount = true;
            var count = 0;
        } else {
            var useCount = false;
            var count = 1;
        }
        console.log(useCount);
        var target = ths.attr('target');
        var toAdd = ths.attr('toAdd');
        toAdd = '<span>' + toAdd + '</span>';

        ths.find(target).each(function() {
            console.log(count);
            if (count != 0) $(toAdd).insertBefore($(this));
            count++;
        });
    });
}

/*
    SET :: ($('#var_def') NOT child of $('#var_container'))
        <div id="var_def">
            <vr value="var1">text1</vr>
            <vr value="var2">text2</vr>
            <vr value="var3">text3</vr>
        </div>

        <div id="var_container">
            ...
            <vr value="var1"></vr><vr value="var1"></vr>
            <vr value="var2"></vr><vr value="var3"></vr>
            <vr value="var3"></vr>
            ...
        </div>

    BECOMES :: (each $('vr') but not $('#var_def'))
        <div id="var_def">...</div>

        <div id="var_container">
            ...
            <vr value="var1">text1</vr><vr value="var1">text1</vr>
            <vr value="var2">text2</vr><vr value="var3">text3</vr>
            <vr value="var3">text3</vr>
            ...
        </div>
*/
function setVariables(name) {
    $('#var_def').find(name).each(function() {
        var ths = $(this);
        ths.hide();
        var target = ths.attr('value');
        var element = ths.html();

        $('#var_container').find(name + '[value="' + target + '"]').each(function() {
            $(this).append(element);
        });
    });
}
