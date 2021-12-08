var DICO = {};
var main = $("#main");
var main_url = 'https://test-renegade.kanak.fr';

$(function() {
    var href_f_ava = $('#ID_F_AVATARS').attr('href');
    var href_m_ava = $('#ID_M_AVATARS').attr('href');
    var href_nb_ava = $('#ID_NB_AVATARS').attr('href');

    var hrefs = [href_f_ava, href_m_ava, href_nb_ava];
    for (avatars of hrefs) OVERALL(avatars);
    log(dlength(DICO));
    DICO = sortObjectByKeys(DICO);
    log(DICO);

    createLinks();
    inputbox();

});

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

function getNextPage(pageContent) {
    var block = pageContent.find('.pages:first-of-type > span:first-of-type').eq(0);
    if (block.length == 0) return false;
    var currentPageStrong = block.find('strong').eq(0);
    if (currentPageStrong.is(':last-child')) return false;
    else return main_url + currentPageStrong.next().next('a').attr('href');
}

function OVERALL(currentPageUrl) {
    var pageContent = gip(currentPageUrl, '#main-content');
    getAllTopicInfosFromPage(pageContent);
    var nextUrl = getNextPage(pageContent);
    if (nextUrl != false) OVERALL(nextUrl);
}

function AddOnePage(currentPageUrl) {
    var pageContent = gip(currentPageUrl, '#main-content');
    getAllTopicInfosFromPage(pageContent);
    //var nextUrl = getNextPage(pageContent);
}

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

//////////////////////////////////////////////////

function createLinks() {
    for (name in DICO) {
        var nameWithoutSpaces = name.replace( /\s/gi, '-');
        var bp = createHTML('a')
                    .attr('href', DICO[name]['url'])
                    .addClass('display-block simple light unset')
                    .attr('target', '_blank');

        bp.append(create('ch').html(name));
        bp.append(
            create('mg')
                .addClass('display-block simple small')
                .append(
                    DICO[name]['messages'] + ' postes')
                );

        bp.append(
            create('a')
                .attr('name', nameWithoutSpaces)
                .addClass('name-link')
        );
        // log(name);
        // log(DICO[name]);
        main.append(bp);
    }
}

function inputbox() {
    var ths = $('#INPUTBOX');
    ths.bind('keyup', function(event) {
        setTimeout(
            function() {
                var name = ths.val();
                if (name != '')
                    window.location.hash = '#' + name.replace( /\s/gi, '-');
            },
        1000);
    });
}


function log(s) {console.log(s);}

function sortObjectByKeys(o) {
    return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}

function dlength(dico) {return Object.keys(dico).length;}

function pause(milliseconds) {
	var dt = new Date();
	while ((new Date()) - dt <= milliseconds) { /* Do nothing */ }
}
