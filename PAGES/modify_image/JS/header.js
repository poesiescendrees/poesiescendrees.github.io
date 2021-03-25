// create an element with 'tagname'
function create(tagname) {return $(document.createElement(tagname))};
// create an element with 'tagname' and containing 'text' (can be anything)
function createHTML(tagname, text) {return create(tagname).html(text)};
// create a link with 'href' and 'text'
function a(href, text) {return createHTML('a', text).attr('href', href);};
//strips the string s of ' ' at its start and end
function strip(s){return ( s || '' ).replace( /^\s+|\s+$/g, '' );}
