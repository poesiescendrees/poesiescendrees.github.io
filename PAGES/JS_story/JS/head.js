// create an element with 'tagname'
function create(tagname) {return document.createElement(tagname)};
// create an element with 'tagname' and containing 'text' (can be anything)
function createHTML(tagname, text) {
    let nw = create(tagname);
    if (typeof text == "string")
        nw.appendChild(document.createTextNode(text));
    else nw.appendChild(text);
    return nw;
};

// create a link with 'href' and 'text'
function createA(href, text) {return createHTML('a', text).attr('href', href);};

Array.prototype.insert = function ( index, ...items ) {
    this.splice( index, 0, ...items );
};

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