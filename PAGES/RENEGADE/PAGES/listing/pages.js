var DICO = {};
var main = $("#main");
var main_url = 'https://test-renegade.kanak.fr';

$(function() {

    ///////// SET AVATARS LIST

    var hrefs = [
        $('#ID_F_AVATARS').attr('href'),
        $('#ID_M_AVATARS').attr('href'),
        $('#ID_NB_AVATARS').attr('href')];

    for (avatars of hrefs) OVERALL(avatars);
    DICO = sortObjectByKeys(DICO);
    createLinks();
    inputbox();

    setParams();

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
function getAllTopicInfosFromPage(pageContent) {
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

        DICO[name] = {'url' : url, 'messages' : messages}
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
function OVERALL(currentPageUrl) {
    var pageContent = gip(currentPageUrl, '#main-content');
    getAllTopicInfosFromPage(pageContent);
    var nextUrl = getNextPage(pageContent);
    if (nextUrl != false) OVERALL(nextUrl);
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
    var exists = $('[name*="' + name + '"]');
    if (exists.length == 0) return false;
    else return $(exists[0]).attr('name');
}

/*
    takes all names from dico and put them in main page
*/
function createLinks() {
    for (name in DICO) {
        var nameWithoutSpaces = tagName(name);

        // <a href="url" class="bp_ava display-block simple light unset" target="_blank"></a>
        var bp = createHTML('a')
                    .attr('href', DICO[name]['url'])
                    .addClass('bp_ava display-block simple light unset')
                    .attr('target', '_blank');

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
    }
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
            if (verifiedName != false) {
                window.location.hash = '#' + verifiedName.replace( /\s/gi, '-');
                var tagged = $('[name="' + verifiedName + '"]').closest('.bp_ava');

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

function log(s) {console.log(s);}

function sortObjectByKeys(o) {
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}

function dlength(dico) {return Object.keys(dico).length;}

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}
