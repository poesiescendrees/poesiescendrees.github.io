var DICO = {};
var main = $("#main");
var main_url = 'https://test-renegade.kanak.fr';

$(function() {

    ///////// SET AVATARS LIST

    var hrefs = [
        [$('#ID_F_AVATARS').attr('href'), 'gender-f'],
        [$('#ID_M_AVATARS').attr('href'), 'gender-m'],
        [$('#ID_NB_AVATARS').attr('href'), 'gender-nb']
    ];

    for (avatars of hrefs) OVERALL(avatars[0], avatars[1]);
    DICO = sortObjectByKeys(DICO);
    createLinks();
    inputbox();

    setParams();
    setFilters();


    //debugRandomFilters();
});





////////// STEP 0 : GLOBAL FUNCTIONS //////////

/*
    gets $(infoCSS) from the url page
*/
function gip(url, infoCSS) {
    var toreturn;
    $.ajax({
        url : url,
        success : function(data) {
            toreturn = $(infoCSS, $(data))
        },
        async: false
    });
    return toreturn;
}





////////// STEP 1 : GET ALL INFOS AND PUT THEM IN DICO //////////

/*
    FA :: from the $(pageContent), fills DICO with
          all the infos needed on the page
*/
function getAllTopicInfosFromPage(pageContent, tags) {
    var topics = pageContent.find('.bp_lsuj');
    for (topic of topics) {
        var tpc = $(topic);

        // find url of topic
        var url = tpc.find('.title_lsuj').eq(0).attr('href');
        url = main_url + url;

        // find number of messages in topic
        var messages = tpc.find('.author_lsuj').eq(0);
        messages = parseInt(messages.text().split(' ')[0]) + 1;

        // find name
        var name = tpc.find('.text_title_lsuj').eq(0).text();

        DICO[name] = {
            'url' : url,
            'messages' : messages,
            'gender-tag' : tags
        }
    }
}

/*
    FA :: gets from the $(pageContent) the url of next page
          if doesn't exist (current page is last), returns false
*/
function getNextPage(pageContent) {
    var block = pageContent.find('.pages:first-of-type > span:first-of-type').eq(0);
    if (block.length == 0) return false;
    var currentPageStrong = block.find('strong').eq(0);
    if (currentPageStrong.is(':last-child')) return false;
    else return main_url + currentPageStrong.next().next('a').attr('href');
}

/*
    FA :: fills DICO with the infos on current page and all following
*/
function OVERALL(currentPageUrl, tags) {
    var pageContent = gip(currentPageUrl, '#main-content');
    getAllTopicInfosFromPage(pageContent, tags);
    var nextUrl = getNextPage(pageContent);
    if (nextUrl != false) OVERALL(nextUrl, tags);
}





////////// STEP 2 : FILLS MAIN PAGE WITH INFOS //////////

/*
    SUBGLOBAL function : return normalized name
*/
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

/*
    SUBGLOBAL function : verify name is on page
        - takes the closest match
        - if no match, returns false
*/
function verifyNameExists(name) {
    if (name == '') return false;
    var exists = $('#main .name_link_ava[name*="' + name + '"]');
    if (exists.length == 0) return false;
    else return $(exists[0]).attr('name');
}

/*
    takes all names from dico and put them in main page
*/
function createLinks() {
    var id = 0;
    for (name in DICO) {
        var nameWithoutSpaces = tagName(name);

        // <a href="url" class="bp_ava display-block simple light unset" target="_blank"></a>
        var bp = createHTML('a')
                    .attr('href', DICO[name]['url'])
                    .attr('id', 'id' + id)
                    .attr('nm', tagName(name))
                    .addClass('bp_ava display-block simple light unset ')
                    .addClass(filtersToAdd(DICO[name]))
                    .attr('target', '_blank');
        id++;

        /*
            <a...>
                <ch>name</ch>
                <mg class="display-block simple small">x postes</mg>
            </a>
        */
        bp.append(create('ch').html(name));
        bp.append(
            create('mg')
                .addClass('display-block simple small')
                .append(
                    DICO[name]['messages'] + ' postes')
                );

        /*
            <a...>
                ...
                <!-- invisible -->
                <a name="formated-name" class="name_link_ava"></a>
            </a>
        */
        bp.append(
            create('a')
                .attr('name', nameWithoutSpaces)
                .addClass('name_link_ava')
        );
        main.append(bp);

        DICO[name]["object"] = bp;
    }
}

function filtersToAdd(dicoName) {
    var filters = '';
    filters += dicoName["gender-tag"];
    var msg = dicoName["messages"];

    var lim1 = 3;
    var lim2 = 6;
    if (msg <= lim1) filters += " msg-small";
    else if (lim1 < msg && msg <= lim2) filters += " msg-middle";
    else filters += " msg-big";
    return filters;
}

/*
    search function
*/
function inputbox() {
    var ths = $('#INPUTBOX');

    // binds event and triggers search when "enter" is pressed
    ths.on('keyup', function(event) {
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();

            // takes & verifies if name matches
            var name = tagName(ths.val());
            var verifiedName = verifyNameExists(name);

            // changes #url if needed
            if (!$('.bp_ava[nm="' + verifiedName + '"]').hasClass('hidden')) {
                if (verifiedName != false) {
                    window.location.hash = '#' + verifiedName.replace( /\s/gi, '-');
                    var tagged = $('.name_link_ava[name="' + verifiedName + '"]').closest('.bp_ava');

                    //triggers tagged avatar for .8s
                    tagged.addClass('tagged_ava');
                    setTimeout(
                        function() {
                            tagged.removeClass('tagged_ava');
                        },
                        800
                    );
                }
            }
        }
    });
}





////////// STEP 3 : PARAMS //////////

function setParams() {
    var bks = $('.hidden_options');
    bks.addClass('hidden');
    bks.prev('.trigger_options').click(function() {
        var bk = $(this).next();
        var toHide = bk.hasClass('hidden');
        bks.addClass('hidden');

        if (toHide) bk.removeClass('hidden');
        else bk.addClass('hidden');
    });
    //$('#PARAM .trigger_options').click();

    affichageOption();
    $('#vignettes_option').click();
}

function affichageOption() {
    var vignettes = $('#vignettes_option');
    var liste = $('#liste_option');
    var colonnes = $('#colonnes_option');

    $('.visual_param label').click(function() {
        var inp = $(this).find('.input_options').eq(0);

        $('.visual_param .input_options').each(function() {
            var cls = $(this).attr('opt');
            $('#main').removeClass(cls);
        });

        $('#main').addClass(inp.attr('opt'));
    });
}





////////// STEP 3 : PARAMS //////////

/*
    SUBGLOBAL function : return normalized name
*/
function increment(input, maxs) {
    if (input.length != maxs.length) return false;
    for (var i = 0; i < input.length; i++)
        if (input[i]>maxs[i]) return false;

    for (var i = input.length - 1; i >= 0; i--) {
        if (input[i] != (maxs[i])) {
            input[i] ++;
            return input;
        } else input[i] = 0;
    }
    // if didn't return then couldn't overflow till done
    // so it reached the max -> returns false AND
    // careful that input = [0,0,...,0]
    return false;
}


function setFilters() {
    //$('#FILTRES .trigger_options').click();

    $('.group_filters').each(function() {
        var group = $(this);
        var groupName = group.attr('groupName');
        group.find('.input_filters').each(function() {
            var ths = $(this);
            ths.attr('name', groupName);
            if (ths.attr('filterName') == "*") {
                ths.prop('checked', true);
                ths.click(function () {
                    starClicked(ths);
                });
            }
            else {
                ths.prop('checked', false);
                ths.click(function () {
                    nonStarClicked(ths);
                });
            }
            ths.click(function() {executeFilters();});
        });
    });
}

function starClicked(ths) {
    ths.closest('.group_filters').find('.input_filters').each(function() {
        if ($(this).attr('filterName') != '*')
            $(this).prop('checked', false);
    });
}

function nonStarClicked(ths) {
    ths.closest('.group_filters').each(function() {
        var c = 0;
        $(this).find('.input_filters').each(function() {
            if ($(this).attr('filterName') == '*')
                $(this).prop('checked', false);
            else {
                if ($(this).prop('checked')) c++;
            }
        });

        if (c == 0) $(this).find('[filterName="*"]').eq(0).prop('checked', true);
    });
}

function executeFilters() {
    var filtersList = calculateFilters();
    //log(filtersList);
    var active = renderActiveFilters(filtersList);
    //log(active);
    sortByFilters(active);
}

function calculateFilters() {
    var filters = {};
    $('.group_filters').each(function() {
        var group = $(this);
        var groupName = group.attr('groupName');
        group.find('.input_filters').each(function() {
            var ths = $(this);
            var filterName = ths.attr('filterName');
            if (ths.prop('checked') && filterName != "*") {
                if (!(groupName in filters))
                    filters[groupName] = [filterName];
                else
                    filters[groupName].push(filterName);
            }
        });
    });
    return filters;
}

function renderActiveFilters(dico) {
    var inp = [];       // array translation of var dico (type dic)
    var outL = [];      // list of concanated filters of each group
                        // ['.x.y.z', '.a.b.c', etc]
    var indexes = [];   // list of indexes used later on
                        // [0,0,etc]
    var lengths = [];   // max index for each el of indexes
                        // [3,6, etc] (for example)
    var separator = ',' // separator for all regexs
    var separator2= '' // separator between the filters

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
                if (i != inp.length - 1) f += separator2;
            }
            outL.push(f);
            indexes = increment(indexes, lengths);
        }
    } else outL = inp; // in case only one group of filters is selected

    return outL;
}

function debugRandomFilters() {
    var filtersList = [];
    $('.debug .input_filters').each(function() {
        var filter = $(this).attr('filterName');
        filter = filter.replace( /\./gi, '');
        if (filter != '*') filtersList.push(filter);
    });
    $('.bp_ava').each(function() {
        var ths = $(this);
        var times = random(0, filtersList.length - 1);
        for (var i = 0; i < times; i++) {
            var x = random(0, filtersList.length - 1);
            ths.addClass(filtersList[x]);
        }
    });
}

function sortByFilters(filters) {
    if (filters.length == 0)
        $('.bp_ava').removeClass('hidden');
    else {
        $('.bp_ava').addClass('hidden');
        for (active of filters) {
            $('.bp_ava' + active).removeClass('hidden');
        }
    }
};





////////// STEP 0 : GLOBAL FUNCTIONS //////////

function log(s) {console.log(s);}

function sortObjectByKeys(o) {
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}

function dlength(dico) {return Object.keys(dico).length;}

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}
