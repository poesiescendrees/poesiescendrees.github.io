// create an element with 'tagname'
function create(tagname) {return $(document.createElement(tagname))};
// create an element with 'tagname' and containing 'text' (can be anything)
function createHTML(tagname, text) {return create(tagname).html(text)};
// create a link with 'href' and 'text'
function createA(href, text) {return createHTML('a', text).attr('href', href);};

// creates mg, mg2, ro
function mg(txt) {return createHTML('mg', txt);}
function mg2(txt) {return createHTML('mg2', txt);}
function ro(txt) {return createHTML('ro', txt);}

// returns a random int [min; max]
function random(min, max) {
  if (min > max) {
    let oldMin = min;
    min = max;
    max = oldMin;
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isChecked(input) {return input.prop('checked');}
function check(input) {input.prop('checked', true);}
function uncheck(input) {input.prop('checked', false);}
