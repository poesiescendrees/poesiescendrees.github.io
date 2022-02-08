$(function() {
  $('.toggle_inside').each(function() {
    var ths = $(this);

    /*finds the toggled target and verifies that it exists*/
    var toggling = ths.attr('toggling');
    if (typeof toggling == 'undefined' || toggling == false) return;
    var togglingJQ = $(toggling);

    if (togglingJQ.length == 0) return;
    else togglingJQ = $(togglingJQ[0]);

    /*sets --display and hides all but 1st child of $(toggling)*/
    var isFirst = 0;
    togglingJQ.find('> *').each(function() {
      var ths = $(this);

      /*verifies what is display for the current element*/
      var display = ths.css('--display');
      if (display == '' || display == 'undefined' || display == false) {
        var display = ths.css('display');
      }
      display = display.trim();
      ths.attr('display', display);

      /*hides all but 1st*/
      if (isFirst == 0) isFirst ++;
      else ths.css('display', 'none');
    });


    /*sets toggle display none*/
    var children = ths.attr('children');
    if (typeof children == 'undefined' || children == false) children = ' > *';

    count = 0;
    ths.find(children).each(function() {
      var ths = $(this);

      /*onclick*/
      var onclick = 'toggleFromList(' + count + ", '" + toggling + "')";
      ths.attr('onclick', onclick);
      ths.addClass('crosshair');
      count ++;
    });

  });
});

function toggleFromList(number, toggling) {
  var ths = $(toggling).eq(0);

  ths.find('> *').each(function() {
    $(this).css('display', 'none');
  });

  var selected = ths.find('> *').eq(number);
  var display = selected.attr('display');
  selected.css('display', display);
}
