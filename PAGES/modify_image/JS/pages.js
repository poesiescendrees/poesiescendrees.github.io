$(function() {
    var body = $('body');
    var main = $('main');

    var sectINP = $('#inputSection');
    var sectOUT = $('#outputSection');
    var input = $('#input');
    var output = $('#output');
    var submit = $('#submit');

    var copy = $('#copy');

    submit.click(function() {
        sectOUT.removeClass('hidden');
        var text = input.val();

        // sets the output classes (in case an error happens)
        output.val('');
        copy.addClass('hidden');
        if (text == '') return;

        // builds text to add to output
        var newText = '';

        var regex = (/(https?:\/\/[^  \[\]\n\t]*\.(?:gif|png|jpg|jpeg))/g);
        var urls = text.match(regex);

        for (let url of urls) {
            newText += '<img src="' + url + '"/>';
        }

        // BUILDS THE CHOICE
        var choice = $('#inputChoiceYes').prop('checked');

        // CHOICE 1 : <a...<img src="..."
        if (choice) {
            var before1 = `<style>k img{`;
            var widthInBefore = '';
            var heightInBefore = '';
            var before2 = `}</style><k>`;
            var after = `</k>`;


            var hasWidth = $('#hasWidth').prop('checked');
            if (hasWidth) {
                var width = $('#width').prop('value');
                if (width != '') widthInBefore = 'width: ' + width + 'px;';
                else hasWidth = false;
            }

            var hasHeight = $('#hasHeight').prop('checked');
            if (hasHeight) {
                var height = $('#height').prop('value');
                if (height != '') heightInBefore = 'height: ' + height + 'px;';
                else hasHeight = false;
            }

            if (hasWidth || hasHeight) {
                console.log('dlnfdklfndf');
                newText = before1 + widthInBefore + heightInBefore + before2 + newText + after;
            }
        }

        // adds to output
        output.val(newText);
        if (newText != '') copy.removeClass('hidden');
    });

    copy.click(function() {
        if (output.val() == '') return;
        output.select();
        document.execCommand('copy');
        var tooltip = copy.find('.tooltip').eq(0);
        tooltip.removeClass('hidden');

        setTimeout(function() {tooltip.addClass('hidden');}, 500);
    });
});
