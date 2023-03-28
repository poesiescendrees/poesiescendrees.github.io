// create an element with 'tagname'
function create(tagname) {return $(document.createElement(tagname))};
// create an element with 'tagname' and containing 'text' (can be anything)
function createHTML(tagname, text) {return create(tagname).html(text)};
// create a link with 'href' and 'text'
function createA(href, text) {return createHTML('a', text).attr('href', href);};

Array.prototype.insert = function ( index, ...items ) {
  this.splice( index, 0, ...items );
};

function randomBool() {
  if (Math.floor(Math.random() * 2)) return true;
  else return false;
}
function strip(s){return ( s || '' ).replace( /^\s+|\s+$/g, '' );}

/*
var arr = [ 'A', 'B', 'E' ];
arr.insert(2, 'C', 'D');

// => arr == [ 'A', 'B', 'C', 'D', 'E' ]
*/

// creates mg, mg2, ro

// returns a random int [min; max]
function random(min, max) {
  if (min > max) {
    let oldMin = min;
    min = max;
    max = oldMin;
  }
  
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tagName(name) {
  return name
      .trim()
      .toLowerCase()
      .replace( /\s/gi, '-')
      .replace( /[^\w-]+/gi, '')
      .replace( /(^-+)|(-+$)/gi, '')
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
  ;
}