// COMPLEMENT FOR https://isotope.metafizzy.co/filtering.html
// (complement by @poesiescendrees)


/*
    INITIATE THE GRID
*/
var $grid = $('.grid-isotope').isotope({
    itemSelector: '.itm',
    layoutMode: 'fitRows',
    percentPosition: false // put true if you use percentage widths, otherwise put false
});

var filters = {};
var filtersList = {};
var separator = ',';

var filterValue = '';

$(function() {
    /*
        CASES
        "*:nth(n)"              checks all
        ".x"                    unchecks all "*"
        ".x,.y"                 checks .x AND .y
        ".x (-.y)"              unchecks .y
        "(-.x)"                 all unchecked -> checks *nth(1)

        TO SET at first
        "*:nth(1)"              checked by default
    */

    // SET BY DEFAULT
    setFiltersDic();
    checksFirstStar();


    // INITIATE THE FILTERS with the buttons
    $('.filter-button').click(function() {

        // the filter
        var ths = $(this);

        // the input of the button
        var inp = ths.find('input').eq(0);

        // the filter name
        var dataFilter = ths.attr('data-filter');

        // the filter group
        var buttonGroup = ths.parents('.button-group');

        // the filter group name
        var groupFilter = buttonGroup.attr('data-filter-group');

        // the potential "select all" filter of the group
        var groupStar = filters[groupFilter]["star"].find('input').eq(0);

        // list used in function
        var l = [];

        // CHECKS if resets with groupStar or not
        if (dataFilter == "*") {
            checkOnlyStar(buttonGroup);
            cleanGroupListFromFilters(buttonGroup);
        } else {
            uncheck(groupStar);
            if (noneChecked(buttonGroup)) check(groupStar);

            //  COMPOSES the filter[groupFilter]["list"]
            buttonGroup.find('.filter-button').each(function() {
                var ths = $(this);
                var isStar = (ths.attr('data-filter') == "*");
                var checked = isChecked(ths.find('input').eq(0));
                if (checked && !isStar) l.push(ths.attr('data-filter'));
            });
        }

        setFilterToGroupListFromFilters(buttonGroup, l);
        changeToFiltersList();

        filterValue = concatenate(filtersList);
        $grid.isotope({filter: filterValue});
    });
});





//////////////////// BY DEFAULT STEPS ////////////////////

/*
    INIT each of the filter groups
*/
function setFiltersDic() {
    $('.button-group').each(function() {
        initGroupFromFilters( $(this) );
    });
}

/*
    CHECK first star input of each filter group
*/

function checksFirstStar() {
    $('.button-group').each(function() {
        checkOnlyStar($(this));
    });
}





//////////////////// MANIPS OF var filters & filtersList ////////////////////
/*
    INITIATE the filters[group] attached to $group :
        -> finds the star in the group
        -> initiates filters list at empty list
*/
function initGroupFromFilters(group) {
    var data = group.attr('data-filter-group');
    filters[data] = {
        "star" : undefined,
        "list" : []
    };

    var star = group.find('.filter-button[data-filter="*"]');
    if (star.length != 0) filters[data]["star"] = star.eq(0);
}

/*EMPTIES the filtersList of $group*/
function cleanGroupListFromFilters(group) {
    filters[group.attr('data-filter-group')]["list"] = [];
}

/*ADDS a filter to list of GroupName*/
function addFilterToGroupListFromFilters(group, filter) {
    filters[group.attr('data-filter-group')]["list"].push(filter);
}

/*SETS a filter to list of GroupName*/
function setFilterToGroupListFromFilters(group, list) {
    filters[group.attr('data-filter-group')]["list"] = list;
}

/*CHANGES filtersList with filters groups lists*/
function changeToFiltersList() {
    for (var group in filters) filtersList[group] = filters[group]["list"];
}





//////////////////// MANIPS OF INPUT FILTERS ////////////////////

/*checks only the first star filter of each group*/
function checkOnlyStar(group) {
    var found = false;
    group.find('.filter-button').each(function() {
        var ths = $(this);
        if (ths.attr('data-filter') == "*" && !found) {
            check(ths.find('input').eq(0));
            found = true;
        }
        else
            uncheck(ths.find('input').eq(0));
    });

    cleanGroupListFromFilters(group);
}

/*returns whether none of the filters in the group is checked (true) or else*/
function noneChecked(group) {
    var inputs = group.find('.filter-button input');
    for (var inp of inputs) if (isChecked($(inp))) return false;
    return true;
}





//////////////////// CONCATENATE PART ////////////////////

function concatenate(dico) {
    var inp = [];       // array translation of var dico (type dic)
    var outL = [];      // list of concanated filters of each group
                        // ['.x.y.z', '.a.b.c', etc]
    var out = '';       // final output
    var indexes = [];   // list of indexes used later on
                        // [0,0,etc]
    var lengths = [];   // max index for each el of indexes
                        // [3,6, etc] (for example)

    //   TRANSLATES DICO INTO A LIST
    // + fills length  (dico[i].length)
    // + fills indexes (0)
    for (var list in dico) {
        if (dico[list].length > 0) {
            inp.push(dico[list]);
            lengths.push(dico[list].length - 1);
            indexes.push(0);
        }
    }

    // (1) creates empty f string
    // (2) takes one possible combination of filters (inp[i][indexes[i]])
    //     and concatenates to the f string
    // (3) push to outL, list of each combination
    // (4) increments indexes so that all combinations are listed
    if (inp.length > 1) {
        while (indexes != false) {
            var f = '';
            for (var i = 0; i < inp.length; i++) {
                f += inp[i][indexes[i]];
            }
            outL.push(f);
            indexes = increment(indexes, lengths);
        }
    } else outL = inp; // in case only one group of filters is selected

    // concatenates the filters combinations to the final output
    for (var i = 0; i < outL.length; i++) {
        out += outL[i];
        if (i != outL.length - 1) out += separator;
    }

    return out;
}

/*
    input is the list to be incremented
    maxs is the respective max of each el of input
    THAT CAN BE REACHED

    ex if you count in binary and input.length == 4
    then maxs = [2,2,2,2]

    returns the input incremented by 1 if possible
    or else false (if input already at max)

        other example :
            maxs  = [5, 2, 0, 2]
            input = [4, 2, 0, 1]

            increment(input, maxs) = [4, 2, 0, 2] -> inc inp[3]
            increment(input, maxs) = [5, 0, 0, 0] -> overflow inp[0]
            increment(input, maxs) = [5, 0, 0, 1] -> inc inp[3]
            ...
            increment(input, maxs) = [5, 2, 0, 2] -> inc inp[3]
            increment(input, maxs) = [0, 0, 0, 0] -> inc inp[3]

*/
function increment(input, maxs) {
    if (input.length != maxs.length) return false;
    for (var i = 0; i < input.length; i++) if (input[i]>maxs[i]) return false;


    for (var i = input.length - 1; i >= 0; i--) {
        if (input[i] != (maxs[i])) {
            input[i] ++;
            return input;
        } else {
            input[i] = 0;
        }
    }
    // if didn't return then couldn't overflow till done
    // so it reached the max -> returns false AND
    // careful that input = [0,0,...,0]
    return false;
}





//////////////////// COMPLEMENTARY ////////////////////

///// debug
function log(txt) {console.log(txt);}
