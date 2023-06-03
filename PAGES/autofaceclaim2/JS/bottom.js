const body = $('body');
const html = $('html');
const mainlist = $('.mainlist').eq(0);

const contactsSelector = ['a', 'buttonlink'];
const itemSelector = ['item', 'item__name'];

const cardInfosSelectors = {

    containerSelector: 'span',
    containerClass: 'infos__container',

    nameSelector: 'span',
    nameClass: 'infos__name',

    infoSelector: 'span',
    infoClass: 'infos__infos',


    newInfo: function(name, info) {
        let toreturn = create(this.containerSelector).addClass(this.containerClass);
        toreturn.append(createHTML(this.nameSelector, name).addClass(this.nameClass));
        toreturn.append(createHTML(this.infoSelector, info).addClass(this.infoClass));
        return toreturn;
    }
};

const defaultname = ['.item--00', 'item--00'];

const defaultMode = 'alphabetical';

const navigationButtons = {
    'js-filters-toggle': 'filters-open',
    'js-navigation-toggle': 'navigation-open'
};

const orderingButtons = {
    alphabetical: 'js-order-alphabetical',
    alphabeticalReversed: 'js-order-alphabetical-reversed',
    digital: 'js-order-digital',
    digitalReversed: 'js-order-digital-reversed',
};

const FILTERS = {
    filterList: $('.filters-list'),
    buttons: $('.filters-list__filter'),

    selectedClass: 'item--selected',
    filteredClass: 'item--filtered',

    filters: {}
}

const FA_MEMBERLIST = {
    // forumURL: 'https://ghostlydazecendres.forumactif.com',
    // forumURL: 'https://whatliesahead.forumactif.com',
    forumURL: 'https://beginagain.forumactif.com',
    // forumURL: 'https://dmthbegins.forumactif.org',


    memberlistTAG: '/memberlist?mode=joined&order',
    indexTAG: '&start=',
    usernameTAG: '&username',
    memberClass: '',


    indexesList: {},
    indexesCount: function() {return Object.keys(this.indexesList).length;},

    debugGetMemberlistURL: function(forumURL, index){
        let forum;
        if (forumURL == false) forum = this.forumURL;
        else forum = forumURL;

        if (index == 0) return forum + this.memberlistTAG + this.usernameTAG;
        else return forum + this.memberlistTAG + this.indexTAG + index + this.usernameTAG;
    },

    getMemberlistURL: function(index) {
        if (index == 0) return this.forumURL + this.memberlistTAG + this.usernameTAG;
            else return this.forumURL + this.memberlistTAG + this.indexTAG + index + this.usernameTAG;
    },

    debugGetNextPageURL: function(forumURL, index) {
        let forum;
        if (forumURL == false) forum = this.forumURL;
        else forum = forumURL;
    },

    newMember: function (index, count) {
        /*
            CHARACTERS.addMembers(
        new Character('Jayce Stillford', 59, "ft. Robbie Wadge", "https://images2.imgbox.com/a9/2e/oyR7n4Ai_o.png", {}, {
            'habitation': 'Amsterdam'
        }, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A nulla assumenda odio, atque aut itaque minima obcaecati odit deleniti vitae, soluta consectetur animi placeat officia, eum laborum! Necessitatibus, quidem molestias!',
        'm age-18-28 occupation-crime occupation-autre finances-precaire celib situation-autre'
        ))
        */

        let profileURL = this.forumURL + index;

        console.log(profileURL);
        

        $.ajax({
            url: profileURL,
            async: true,
            type: 'GET',
            dataType: 'html',
            cache: false,
            success: function (data) {
                let test = $('.h_member', $(data)).text();
                console.log(test, count);
            }
        });



        return false;

        /*
            $.ajax({
            
            });
        */
    },


    getAllMembers: function() {
        

        let allRetrieved = false;
        let errorCount = 20;
        let pageCount = 0;

        while (!allRetrieved) {
            let url = this.getMemberlistURL(pageCount);
            let gips = gip(url, 'a[href^="/u"]' + this.memberClass);
            
            console.log(url);
            // console.log(gips);

            if (gips.length == 0) allRetrieved = true;
            else {
                for (let link of gips) {
                    let u = $(link).attr('href');
                    if (this.indexesList[u] == undefined) {
                        this.indexesList[u] = false;
                        // this.newMember(u, pageCount);
                        pageCount++;
                        // console.log(pageCount, u);
                    }
                }
    
                errorCount--;
                if (errorCount <= 0) allRetrieved = true;
            }

            

        }

        

        console.log(this.indexesList);
        console.log(this.indexesCount());

        let count = 0;

        for (member in this.indexesList) {
            this.newMember(member, count);
            
            count ++;
            
        }
    }

}






////////////////////////////// BUILD PAGE, SORTING PART //////////////////////////////


const defaultItem = {

    item: $('.item--00'),
    defaultItemClass: 'item--00',
    itemClass: 'item',
    itemIndexClass: 'item--',


    nameClass: 'item__name',
    subtitleClass: 'item__subtitle',
    avatarClass: 'item__avatar',

    infosBlockClass: 'item__listBlock',
    infosClass: 'item__list',

    detailsBlockClass: 'item__detailsBlock',
    detailsClass: 'item__details',

    contactClass: 'item__contact',
    

    infos: cardInfosSelectors,




    clone: function() {
        return this.item.clone();
    },


    findName: function(item) {
        let name;
        if (item.hasClass(this.defaultItemClass)) {
            name = strip(item.find(this.nameClass).html());
        } else {
            let tofind = item.find('.' + this.itemClass);
            if (tofind.length != 0) tofind = tofind.eq(0);
            else {
                tofind = item.closest('.' + this.itemClass);
                if (tofind.length != 0) tofind = tofind.eq(0);
                else return false;
            }
            name = strip(tofind.find('.' + this.nameClass).html());
        }
        return name;
    },

    findIndex: function(item) {
        let rgx = new RegExp(this.itemIndexClass + "(\\d+)");
        // let rgx = /item--(.\d)/;
        let classes;
        if (item.hasClass(this.itemClass))
            classes = item.attr('class');
        else {
            let tofind = item.find('.' + this.itemClass);
            if (tofind.length != 0) tofind = tofind.eq(0);
            else {
                tofind = item.closest('.' + this.itemClass);
                if (tofind.length != 0) tofind = tofind.eq(0);
                else return false;
            }
            classes = tofind.attr('class');
        }
        let result = classes.match(rgx);
        if (result != null) return result[1];
    },

    copy: function(name, index, subtitle, avatar, contacts, infos, details, filters) {
        let newItem = this.clone();

        // UPDATE CLASSES
        newItem.removeClass(this.defaultItemClass).addClass(this.itemIndexClass + index);
        
        // UPDATE ID WITH TAGNAME (for search)
        newItem.attr('id', tagName(name));
        
        // ADD FILTER
        newItem.attr('data-filters', filters);
        newItem.addClass(FILTERS.selectedClass);

        // UPDATE name, subtitle, avatar url
        newItem.find('.' + this.nameClass).eq(0).html(name);
        newItem.find('.' + this.subtitleClass).eq(0).html(subtitle);
        newItem.find('.' + this.avatarClass).eq(0).attr('src', avatar);
        

        // UPDATE infos part
        if (details == '') newItem.find('.' + this.detailsBlockClass).remove();
        else newItem.find('.' + this.detailsClass).eq(0).html(details);

        let infosList = newItem.find('.' + this.infosClass).eq(0);

        if (Object.keys(infos).length != 0) {
            // let count = 0;
            for (info in infos) {
                let newInfo = cardInfosSelectors.newInfo(info, infos[info]);
                infosList.append(newInfo);
            }
        } else {
            newItem.find('.' + this.infosBlockClass).remove();
        }


        // UPDATE contacts list
        if (Object.keys(infos).length != 0) {
            let contactsList = newItem.find('.' + this.contactClass).eq(0);
            for (contact in contacts) {
                let newContact = createHTML(contactsSelector[0], contact).addClass(contactsSelector[1]).attr('href', contacts[contact]);
                contactsList.append(
                    createHTML('li', newContact)
                );
            }
        }

        return newItem;
    },

    createCharacterHTML: function(character) {
        return this.copy(
            character.name,
            character.index,
            character.subtitle,
            character.avatar,
            character.contacts,
            character.infos,
            character.details,
            character.filters
        );
    }
};

var CHARACTERS = {
    mode: defaultMode,
    reversedMode: false,

    getMembers: function() {
        return mainlist.find('.' + defaultItem.itemClass);
    },

    sortAlphabetically: function(reversed) {
        let members = this.getMembers();

        members.sort(function(a, b) {
            let ai = defaultItem.findName($(a));
            let bi = defaultItem.findName($(b));
            if (ai < bi) return -1;
            else if (ai > bi) return 1;
            else return 0;
        });

        mainlist.html('');

        console.log(members);
        for (let member of members)
            if (reversed) mainlist.prepend(member);
            else mainlist.append(member);
    },

    sortDigitally: function(reversed) {
        let members = this.getMembers();

        members.sort(function(a, b) {
            let ai = defaultItem.findIndex($(a));
            let bi = defaultItem.findIndex($(b));
            if (ai < bi) return -1;
            else if (ai > bi) return 1;
            else return 0;
        });

        mainlist.html('');

        for (let member of members)
            if (reversed) mainlist.prepend(member);
            else mainlist.append(member);

    },

    changeMode: function(mode, reversed) {
        if (mode == 'alphabetical') {
            this.mode = 'alphabetical';
            if (reversed == true) {
                this.reversedMode = true;
                this.sortAlphabetically(true);
            } else {
                this.reversedMode = false;
                this.sortAlphabetically();
            }
        } else if (mode == 'digital') {
            this.mode = 'digital';
            if (reversed == true) {
                this.reversedMode = true;
                this.sortDigitally(true);
            } else {
                this.reversedMode = false;
                this.sortDigitally();
            }
        } else return -1;
    },

    // Θn + Θ(.sort())
    addMembers: function(...list) {

        // SORTS LIST FROM START
        // then compares to be added list to existing items list :
        // first puts existing > list
        // then puts the rest at the beginning


        // sorts
        if (this.mode == 'alphabetical')
            list = list.sort(function(a, b) {
                if (a.name < b.name) return -1;
                else if (a.name > b.name) return 1;
                else return 0;
            });

        else
            list = list.sort(function(a, b) {
                if (a.index < b.index) return -1;
                else if (a.index > b.index) return 1;
                else return 0;
            });

        // existing items
        let existingItems = this.getMembers();

        // loops 1st through the list
        for (let i = 0; i < existingItems.length; i++) {

            // name string compared
            let indexCompared = defaultItem.findIndex($(existingItems[i]));
            let nameCompared = defaultItem.findName($(existingItems[i]));
            
            let comparison;
            let counter = 950;


            while (true) {
                // if no element to add anymore
                if (list.length == 0) break;

                // result from comparison, if (a < b) 1, if (a > b) -1, else 0
                if (this.mode == 'alphabetical')
                    comparison = list[0].compareNames(nameCompared);
                else comparison = list[0].compareIndex(indexCompared);

                // appends new element after compared one
                if (comparison >= 0) {
                    let closest = existingItems.eq(i).closest('li');

                    closest.before(
                        defaultItem.createCharacterHTML(list[0])
                    );

                    // removes new element from list
                    list.splice(0, 1);
                } else {
                    // if all elements from list are before compared one,
                    // stops the comparison and goes to the next existing element
                    break;
                }


                // makes sure doesnt loop endlessly
                if (counter < 0) {console.log("ERROR"); break;}
                else counter --;
            }
        }

        // all remaining elements are before the compared existing items
        for (let i = 0; i < list.length; i++) {
            mainlist.append(defaultItem.createCharacterHTML(list[i]));
        }
    }
}

function Character(name, index, subtitle, avatar, contacts, infos, details, filters) {
    this.name = name;
    this.index = index;
    this.infos = infos;
    this.details = details;
    this.subtitle = subtitle;
    this.avatar = avatar;
    this.contacts = contacts;
    this.filters = filters;

    this.compareNames = function(character) {
        let comparator;
        if (typeof character == 'string') comparator = character;
        else comparator = character.name;

        if (this.name < comparator) return 1;
        else if (this.name > comparator) return -1;
        else return 0;
    }

    this.compareIndex = function(character) {
        let comparator;
        if ((typeof character == 'number') || (typeof character == 'string')) comparator = character;
        else comparator = character.index;

        if (this.index < comparator) return 1;
        else if (this.index > comparator) return -1;
        else return 0;
    }
}






////////////////////////////// INPUTBOX //////////////////////////////

function inputbox() {
    let ths = $('.js-search');
    ths.on('keyup', function (event) {
        if (event.keyCode === 13) {
            // Cancel default action if needed
            event.preventDefault();

            // takes & verifies if name matches
            let searched = tagName(ths.val());
            let verifiedList = correspondingList(searched);

            if (verifiedList.length != 0) {
                console.log(verifiedList);
                window.location.hash = '#' + verifiedList[0].replace( /\s/gi, '-');
            }
        }
    });
}

function correspondingList(searched) {
    if (searched == '') return [];

    let toreturn = [];
    let rgx = new RegExp(searched);
    $('.' + defaultItem.itemClass + '.' + FILTERS.selectedClass).each(function() {
        let id = $(this).attr('id');
        if (id == undefined) return;
        if (id.match(rgx) != null)
        toreturn.push(id);
    });
    return toreturn;
}






////////////////////////////// NAVIGATION && FILTERS //////////////////////////////

function setSliderButtons() {
    for (button in navigationButtons) {
        let toggled = navigationButtons[button];
        $('.' + button).on('click', function() {
            body.toggleClass(toggled);
        });
    }

    $('.' + orderingButtons.alphabetical).on('click', function() {
        CHARACTERS.sortAlphabetically();
        console.log('you sorted');
    });
    $('.' + orderingButtons.alphabeticalReversed).on('click', function() {
        CHARACTERS.sortAlphabetically(true);
        console.log('you sorted');
    });
    $('.' + orderingButtons.digital).on('click', function() {
        CHARACTERS.sortDigitally();
        console.log('you sorted');
    });
    $('.' + orderingButtons.digitalReversed).on('click', function() {
        CHARACTERS.sortDigitally(true);
        console.log('you sorted');
    });
}

function setFilters() {
    let list = FILTERS.filterList;
    let buttons = FILTERS.buttons;

    buttons.each(function() {
        $(this).on("click", function() {
            let ths = $(this);
            let group = $(this).closest('.filters-list__group');
            let groupName = group.attr('data-name');
            FILTERS.filters[groupName] = [];

            if (ths.attr('data-filter') == '*') {
                deselectAllFiltersByGroup(group);
            }
            else {
                ths.toggleClass("selected");
                FILTERS.filters[groupName] = getSelectedFiltersByGroup(group);
                if ((FILTERS.filters[groupName].length == 0)) deselectAllFiltersByGroup(group);
                else {
                    group.find('.filters-list__filter[data-filter="*"]').removeClass('selected');
                }
            }

            // if ((group.find('.filters-list__filter').length - 1) == FILTERS.filters[groupName].length) FILTERS.filters[groupName] = [];


            setVisibleCards();
        });
    });
}

function deselectAllFiltersByGroup(group) {
    group.find('.filters-list__filter').each(function() {
        if ($(this).attr('data-filter') == '*')
        $(this).addClass('selected');
        else $(this).removeClass('selected');
    });
}

function getSelectedFiltersByGroup(group) {
    let toreturn = [];
    group.find('.filters-list__filter').each(function() {
        if ($(this).hasClass('selected') && $(this).attr('data-filter') != '*') toreturn.push($(this).attr('data-filter'));
    });

    return toreturn;
}

function setVisibleCards() {
    let filters = FILTERS.filters;
    for (filterGroup in filters) {
        if (filters[filterGroup].length == 0) {
            delete filters[filterGroup]
        }
    }
    let filtersCount = Object.keys(filters).length;


    $('.' + FILTERS.filteredClass).each(function() {
        let ths = $(this);
        let classes = ths.attr('data-filters');

        let groupCount = 0;
        for (group in filters) {
            let count = 0;
            for (filter of filters[group])
                if (classes.match(filter) != null)count ++;
            if (count != 0) {
                groupCount ++;
            }
        }
        if (groupCount == filtersCount) ths.addClass('item--selected');
        else ths.removeClass('item--selected');
    });
}

function classRegex(className) {
    return new RegExp('^' + className + '\\s|\\s' + className + '$|\\s' + className + '\\s', 'gm');

}










////////////////////////////// GIP //////////////////////////////

/*
    gets $(infoCSS) from the url page
*/
function gip(url, infoCSS) {
    var toreturn;
    $.ajax({
        url : url,
        type: 'GET',
        dataType: 'html',
        success : function(data) {
            toreturn = $(infoCSS, $(data))
        },
        async: false
    });
    return toreturn;
}

function setCharacterPages() {
    FA_MEMBERLIST.getAllMembers();
}










////////////////////////////// INIT //////////////////////////////






$(function() {
    setCharacterPages();
    debug(); 
    inputbox();
    setSliderButtons();
    setFilters();

//    CHARACTERS.sortAlphabetically();

    // CHARACTERS.changeMode('digital', true);
});


function debug(){
    CHARACTERS.addMembers(
        new Character('Jayce Stillford', 59, "ft. Robbie Wadge", "https://images2.imgbox.com/a9/2e/oyR7n4Ai_o.png", {}, {
            'habitation': 'Amsterdam'
        }, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A nulla assumenda odio, atque aut itaque minima obcaecati odit deleniti vitae, soluta consectetur animi placeat officia, eum laborum! Necessitatibus, quidem molestias!',
        'm age-18-28 occupation-crime occupation-autre finances-precaire celib situation-autre'
        ),

        new Character("Albane Hollander", 12, "ft. Damaris Goddrie", "https://images2.imgbox.com/e1/f4/pbPYRYGN_o.png", {
            'Présentation': '#top'
        }, {
            'habitation': 'New-York',
            'métier': 'Yolala'
        }, '',
        'f age-18-28 situation-celib'
        ),

        new Character("Fearghas MacRuairidh", 32, "ft. Matthew Clavane", "https://images2.imgbox.com/ae/8b/qGa6xgrN_o.png", {}, {}, '',
        ''
        ),

        new Character("Kiran May", 42, "ft. Andy Blossom", "https://images2.imgbox.com/55/60/y6dqjKuM_o.png", {}, {}, '',
        ''
        ),

        new Character("Havard Ellingsen", 59, "ft. Lucky Blue Smith", "https://images2.imgbox.com/ef/da/n30jiL3L_o.png", {}, {}, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A nulla assumenda odio, atque aut itaque minima obcaecati odit deleniti vitae, soluta consectetur animi placeat officia, eum laborum! Necessitatibus, quidem molestias!',
        ''
        ),
        
        new Character("Willa Hosenburg", 29, "ft. Pia Kristine Cruz", "https://images2.imgbox.com/af/39/hqNQU2rg_o.png", {}, {}, '',
        ''
        ),
        
        new Character("Phèdre Saint-Hillaire", 53, "ft. Michael Gioia", "https://images2.imgbox.com/70/9b/2YTFI3NG_o.png", {}, {}, '',
        ''
        ),
        
        new Character("Sidonie Hasegawa", 18, "ft. Serena Motola", "https://images2.imgbox.com/cf/c3/AVeQtnof_o.gif", {
            'Carnet de Bord': '#bottom'
        }, {
            'côté coeur': 'côté rue'
        }, '',
        ''
        ),
        
        new Character("Erhart Hegewald", 98, "ft. Troye Sivan", "https://images2.imgbox.com/35/fb/4dlAeM2D_o.png", {}, {}, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A nulla assumenda odio, atque aut itaque minima obcaecati odit deleniti vitae, soluta consectetur animi placeat officia, eum laborum! Necessitatibus, quidem molestias!',
        ''
        ),
        
        new Character("Priam Greyback", 77, "ft. Cameron Porras", "https://images2.imgbox.com/10/ae/EEHfPglX_o.png", {}, {}, '',
        ''
        ),
        
        new Character('Declan Greenwoods', 23, 'ft. Emile Woon', 'https://images2.imgbox.com/9a/23/y56Yogcz_o.png', {}, {}, 'Lorem ipsum dolor sit amet consectetur adipisicing elit. A nulla assumenda odio, atque aut itaque minima obcaecati odit deleniti vitae, soluta consectetur animi placeat officia, eum laborum! Necessitatibus, quidem molestias!',
        ''
        )
    );
}