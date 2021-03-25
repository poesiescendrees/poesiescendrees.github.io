var colorPicker = '.color_picker';
window.addEventListener("load", startup, false);

function startup() {
    $(colorPicker).each(function() {
        var ths = $(this);
        var inp = ths.find('input[type="color"]').eq(0);

        inp.bind('input', updateFirst);
        inp.bind('change', updateFinal);
    });
}

function updateFirst(event) {
    var lbl = $(this).closest(colorPicker).find('label').eq(0);
    var val = event.target.value;

    lbl.html(val);
}

function updateFinal(event) {
};
