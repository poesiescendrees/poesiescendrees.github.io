/////// USE OF TOGGLE
/*

    LIST OF DIFFERENT FUNCTIONS & CLASSES IN THE PACKAGE :

        :: toggle/hide/display (button toggling & hiding)
        -> triggering $(element) will hide/display $(target)
           or will toggle it (if already hidden, display it,
           otherwise it will hide it)
        -> example :

            <element class="toggle/hide/display" target="target"></element>

            <target>this element will be displayed or hidden</target>




        :: toggle_inside (list of tabs with buttons)
        -> at first, all children of $(parentTarget) are hidden and
           triggering the $(triggers:nth-of-type) inside the $(element)
           will the child:nth-of-type of $(parentTarget)
        -> example :

            <element class="toggle_inside" toggling="parentTarget" children="triggers">
                <triggers>first</triggers>
                <triggers>second</triggers>
                <triggers>third</triggers>
            </element>

            <parentTarget>
                <element>toggled with first trigger</element>
                <element>toggled with second trigger</element>
                <element>toggled with third trigger</element>
            </parentTarget>




        :: toggle_from_list (button toggling element from specific parent)
        -> triggering $(element) will hide all children of $(parentTarget)
           no matter their initial state, and $(target) will be displayed
        -> example :

            <element class="toggle_from_list" toggling="parentTarget" target="target:nth-of-type(2)"></element>

            <parentTarget>
                <target>after trigger, this is hidden</target>
                <target>after trigger, only this is displayed</target>
                <target>after trigger, this is hidden</target>
            </parentTarget>




    NOTES :
        --> none of the classes or id or localName
        should start with a number
        (it is a rule in CSS but it's very important in
        this javascript code, otherwise functions may not work)

        IF YOU USE AT LEAST ONE OF THOSE CLASSES :
        --> in CSS, set for (each) target its var(--display) :
                target {--display: block/grid/etc.;}
            so that when you click on a trigger, it displays
            the specific target with the value of var(--display)
            (if not specified, it is automatically set to --display: block)

        IF YOU USE "toggle_inside" OR "toggle_from_list" :
        --> aesthetically better if you already mention in css :
            target {display: none;}
            target:first-of-type {display : block/grid/etc.}
        though, it will work without that but it will
        appear briefly while the page is loading

        IF YOU USE "toggle_inside" :
        --> you can put the parentTarget within the element
            (the parent of the triggers) but you should explicitely
            specify that it is not a trigger :
            example :

                <div class="toggle_inside" toggling=".test">
                    <button>one</button>
                    <button>two</button>

                    <div class="test">
                        <span>displayed with one</span>
                        <span>displayed with two</span>
                    </div>
                </div>

                --> the $('.test') is taken as a trigger,
                like the other buttons, so when you
                click on the div, it hides all elements within itself
                and searches for its third elements.
                (which normally doesn't exist, except if you put a
                third <span> in $('.test'))
                --> if you wanna correct that behavior, specify
                    that only <button> are triggers so that
                    <div> is not taken as such :

                <div class="toggle_inside" toggling=".test" children="button">
                    ...
                </div>
*/



setToggleInside(".toggle_inside");
setToggleInside(".toggle_from_list", 'toggling', 'undefined');

setFunctions(".toggle", "flipDisplay", ["target"]);
setFunctions('.display', 'display', ["target"]);
setFunctions('.hide', 'hide', ["target"]);



function getClass(el) {
  return $(el).attr('class').split(' ');
}

function setFunctions(targetSelector, nameFunction, listOfArgs=[]) {
  $(targetSelector).each(function() {
    var ths = $(this);

    var onclick = nameFunction + "(";

    for (var i = 0; i < listOfArgs.length; i++) {
      var toAdd = ths.attr(listOfArgs[i]);
      if (typeof toAdd == 'string') toAdd = "'" + toAdd + "'";
      if (i != (listOfArgs.length - 1)) toAdd += ",";
      onclick += toAdd;
    }
    onclick += ')';
    ths.attr('onclick', onclick);
  });
}

function hide(el) {
  var ths = $(el);
  if (typeof ths.css('--display') == 'undefined') {
    if (ths.css('display') != 'none') ths.css('--display', ths.css('dislay'));
    else ths.css('--display', 'block'); // default : block
  }
  ths.css('display', 'none');
}

function display(el) {
  var ths = $(el);
  if (typeof ths.css('--display') == 'undefined') ths.css('--display', 'block');
  ths.css('display', ths.css('--display'));
}

function flipDisplay(el) {
  var ths = $(el);
  if (ths.css('display') != 'none') {
    if (typeof ths.css('--display') == 'undefined') ths.css('--display', ths.css('display'));
    ths.css('display', 'none');
  } else {
    if (typeof ths.css('--display') == 'undefined') ths.css('--display', 'block');
    ths.css('display', ths.css('--display'));
  }
}

function setToggleInside(parentSelector='.toggle_inside', parentAttr='toggling', childrenSelector='children', targetAttr="target") {

  $(parentSelector).each(function() {
    var ths = $(this);

    // verifies which children to set : selects all if not specified
    if (childrenSelector == 'undefined') {
      var setFrom = ths;
    } else {
      var children = ths.attr(childrenSelector);
      if (typeof children == 'undefined' || children == '') {
        children = '*';
      }
      var setFrom = ths.find(children);
    }

    var target = ths.attr(parentAttr);
    var count = 0;
    var tgt = ths.attr(targetAttr);

    if (typeof target != 'undefined') {
      var xx = ths.find(children);
      setFrom.each(function() {
        count++;

        if (typeof ths.attr(targetAttr) == 'undefined') {
            var totoggle = count;
        } else if (!isNaN(parseInt(tgt))) {
            var totoggle = parseInt(tgt);
        } else {
            var totoggle = tgt;
            $('.section1').append(isNumeric('3a'));
        }

        if (typeof totoggle == 'string') totoggle = "'" + totoggle + "'";

        var onclick = `toggleFromList('` + target + `',` + totoggle + `)`;

        $(this).attr('onclick', onclick);
      });
    }

    if (parentSelector == '.toggle_inside') {
        toggleFromList(target);
    }

  });
}


/**

Sets all $(nameChildren nameParent) to 'display: none'
and sets $(nameChildren nameTarget) to 'display : var(--display)'
                                       (sets it to 'block' if undefined);

 * @param             {string}  nameParent     name of parent

 * @param   {string || number}  nameTarget     name of child which is toggled
                                               if 'string' : child within the parent
                                               if 'number' : nameChildren:nth-of-type
                                                             (:nth-child if nameChildren == '*')
                                               // DEFAULT : 1 (:first-of-type/first-child)

 * @param             {string}  nameChildren   name of children to be hidden within the parent
                                               DEFAULT : '*' (all children)

       example :
           <section>
             <span class="el1">span 1</span>
             <span class="el2">span 2</span>
             <span class="el3">span 3</span>
             <div class="el4">div 1</div>
             <div class="el5" style="--display: grid;">div 2</div>
           </section>

           >>> toggle('section')
           .el[2:5] - display : none      // hidden by the function
           .el1 - display : block         // targetted by default with default --display

           >>> toggle('section', '4')
           .el[1:5 \ 4] - display : none  // hidden by the function
           .el4 - display : block         // targetted with default --display

           >>> toggle('section', 2, 'div')
           .el[1:3] - display : inline    // not affected by the function
           .el4 - display : none          // hidden by the function
           .el5 - display: grid;          // targetted with its --display
 */
function toggleFromList(nameParent, nameTarget=1, nameChildren='*') {
  var all = $(nameParent);

  // [ STEP 1 ] verifies the name of target
  if (typeof nameTarget == 'number') {

    if (nameChildren == '*') {
      nameTarget = nameChildren + ':nth-child(' + nameTarget + ')';
    } else {
      nameTarget = nameChildren + ':nth-of-type(' + nameTarget + ')';
    }
  }

  // [ STEP 2 ] sets every children selected with 'display: none'
  // and checks every '--display:' (sets to 'block' if undefined)
  all.children(nameChildren).each(function() {
    var ths = $(this);

    if (typeof ths.css('--display') == 'undefined'){
      ths.css('--display', 'block');
    }

    if (ths.css('display') != 'none') {
      ths.css('display', 'none');
    }

  });

  // [ STEP 3 ] displays the target (from [STEP1]) to its --display
  all.children(nameTarget).each(function() {
    $(this).css('display', $(this).css('--display'));
  });
}

function css (el='body', attr='background', color='red'){
    $(el).css(attr,color);
}

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

function setAddBefore() {
    $('[class^="addBefore"]').each(function() {
        var ths = $(this);
        var adding = ths.attr('class').split('-')[1];
        var toAdd = ths.attr('toAdd');
        var count = 0;
        ths.find(adding).each(function() {
            if (count != 0) $(toAdd).insertBefore($(this));
            count++;
        });
    });
}
