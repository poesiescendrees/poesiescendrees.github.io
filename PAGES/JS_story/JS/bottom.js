////////////////// VERSION WITH PARENTS HANDLING

let id = 0;
let NODES = {};

let memory = {
    prevl: [],
    limit: 3
};
let settings = {
    easyMode: true
};

// let CHARACTER = {
//     name: 'Patrick',
//     life: 100,
//     maxLife: 100,
//     attackPower: 5,
//     roll: function(rollmax) {
//         if (rollmax == undefined) rollmax = 20;
//         return random(0, rollmax);
//     }
// };

(function() {

    for (let i = 0; i < 15; i++) {
        NODES[i] = new Node(i, {
            name: 'child' + i,
            text: 'text for ' + i,
            subtitle: 'subtitle for ' + i
        });
    }

    NODES[0].add(
        NODES[1].add(
            NODES[11].add(
                NODES[12],
                NODES[13],
                NODES[14]
            )
        ),
        NODES[2].add(
            NODES[3],
            NODES[4].add(
                NODES[5].add(
                    NODES[6],
                    NODES[7].add(
                        NODES[9],
                        NODES[10]
                    ),
                    NODES[8]
                )
            )
        )
    );
    
    
    NODES[5].add([true, NODES[2]]);
    NODES[8].add([true, NODES[8]]);
    NODES[0].log();
    
    console.log('---------------');

    NODES[0].appendCard();
})();




/////////////////////// NODES

function Node(id, infos) {
    this.id = id;
    this.parent = null;

    // will define the accessible path from this node
    this.children = [];
    
    // html card, defined later on and modifiable
    this.card = null;

    // contains all in game information
    this.content = infos != undefined ? new Content(infos) : new Content({});

    // debug log through hierarchy
    this.log = function() {
        console.log(this.content.name);
        for (let i = 0; i < this.children.length; i++) {
            if (!(Array.isArray(this.children[i]))) {
                this.children[i].log();
            } else console.log(`(${this.children[i][1].content.name} - loop)`);
        }
    }

    // removes child
    this.removeChild = function(removed) {
        for (let i = 0; i < this.children.length; i++) {
            if (removed === this.children[i]) {
                removed.parent = null;
                this.children.splice(i, 1);
                break;
            }
        }
    }

    this.changeParent = function(newParent) {
        if (this.hasParent()) this.parent.removeChild(this);
        this.parent = newParent;
        this.parent.children.push(this);
    }

    this.hasParent = function() {
        return (this.parent instanceof Node);
    }

    this.isLeaf = function() {
        return (this.children.length == 0);
    }

    this.getChild = function(i) {
        let toreturn = this.children[i];
        if (toreturn instanceof Node) return toreturn;
        else return toreturn[1];
    }


    /////// ADDS ONE OR MORE NODES AS CHILDREN
    this.add = function(...toAdd) {
        for (let i = 0; i < toAdd.length; i++) {
            let child = toAdd[i];

            // if array it would be [true, Node]
            // if this the node is a loop (its parent is node changed)
            if (Array.isArray(child)) {
                this.children.push(child);
            }

            // if new Node child
            else if (child instanceof Node) {

                // in case modify path of new child
                if (child.hasParent()) 
                    child.parent.removeChild(child);
                child.changeParent(this);
                // this.children.push(child);
            }

            // happens node to the overall list of nodes
            NODES[child.id] = child;
        }
        return this;
    }

    ///////// CREATES HTML CARD
    this.createCard = function() {

        // gets model
        let article = document.querySelector('#JS_CARD_model').cloneNode(true);

        // modify id
        article.id = 'JS_CARD_' + this.id;
        article.dataset.id = this.id;

        // changes needed stuff
        this.content.updateCardInfos(article);
        

        ///// BUTTONS HANDLING
        let buttons = [];
        
        for (let i = 0; i < this.children.length; i++) {
            let child = this.getChild(i);

            // creates button
            let button = createHTML('li', createHTML('button', child.content.buttonName));
            try {
                button.classList.add(child.content.buttonClasses);
            } catch (e) {}
            button.dataset.id = child.id;
            
            button.addEventListener(
                "click",
                function (event) {
                    console.log(this.dataset.id);
                    
                    // adds to memory if easy mode : enables ctrl + Z
                    if ((settings.easyMode == true)) {
                        let last = document.querySelector('#ADDING .js-card').dataset.id;
                        last = parseInt(last);
                        memory.prevl.push(last);
                        if (memory.prevl.length > memory.limit) memory.prevl.splice(0, 1);
                        console.log(`adds to memory : ${memory.prevl}`);
                    }


                    NODES[this.dataset.id].appendCard();
                    // this.appendCard();
                }
            );
            buttons.push(button);
        }

        ////// append here other buttons

        // CTRL + Z : creates a button allowing ctrl + z
        // when click on it, takes last element before now and goes there. deletes memory
        if (memory.prevl.length != 0) {
            let previous = createHTML('li', createHTML('button', 'previous'));
            previous.addEventListener(
                "click",
                function (event) {
                    let prevElement = memory.prevl[memory.prevl.length - 1];
                    memory.prevl.splice(memory.prevl.length - 1, 1);
                    NODES[prevElement].appendCard();
                    console.log(`removes from memory : ${memory.prevl}`);
                }
            );
            buttons.splice(0, 0, previous);
        }

            
        // appends all buttons
        for (button of buttons) article.append(button);


        ////////// ADDS CARD
        this.card = article;
        return this.card;
    }

    this.getCard = function() {
        if (this.card == null) return this.createCard();
        else return this.card;
    }

    this.appendCard = function() {
        let doc = document.querySelector('#ADDING');
        doc.innerHTML = '';
        doc.appendChild(this.createCard());
    }
}





////////////// IN GAME INFORMATIONS
function Content(infos) {

    this.name = infos.name != undefined ? infos.name : 'nameless';
    this.text = infos.text != undefined ? infos.text : 'textless';
    this.subtitle = infos.subtitle != undefined ? infos.subtitle : 'subtitleless';
    this.buttonName = this.name;
    this.buttonClasses = infos.buttonClasses != undefined ? infos.buttonClasses : '';

    this.log = function() {console.log(this.name);}

    this.updateCardInfos = function(article) {
        article.querySelector('.js-card__title').innerHTML = this.name;
        article.querySelector('.js-card__subtitle').innerHTML = this.subtitle;
        article.querySelector('.js-card__text').innerHTML = this.text;
    }
}