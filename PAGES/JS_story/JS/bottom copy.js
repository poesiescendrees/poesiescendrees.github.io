////////////////// VERSION WITH PARENTS HANDLING

let id = 0;
let NODES = {};

let memory = [];
let memoryLimit = 3;
let settings = {
    easyMode: true
};

let CHARACTER = {
    name: 'Patrick',
    life: 100,
    maxLife: 100,
    attackPower: 5,
    roll: function(rollmax) {
        if (rollmax == undefined) rollmax = 20;
        return random(0, rollmax);
    }
};

(function() {
    var root = new Node(0, {name: 'ROOT'});
    var child1 = new Node(1, {name: 'child1'});
    var child2 = new Node(2, {name: 'child2'});
    var child3 = new Node(3, {name: 'child3'});
    var child4 = new Node(4, {name: 'child4'});
    var child5 = new Node(5, {name: 'child5'});
    var child6 = new Node(6, {name: 'child6'});
    var child7 = new Node(7, {name: 'child7'});
    var child8 = new Node(8, {name: 'child8'});
    var child9 = new Node(9, {name: 'child9'});
    var child10 = new Node(10, {name: 'child10'});
    var child11 = new Node(11, {name: 'child11'});
    var child12 = new Node(12, {name: 'child12'});
    var child13 = new Node(13, {name: 'child13'});
    var child14 = new Node(14, {name: 'child14'});

    NODES[0] = root;



    root.add(
        child1.add(
            child11.add(
                child12, child13, child14
            )
        ),
        child2.add(
            child3,
            child4.add(
                child5.add(
                    child6,
                    child7.add(
                        child9,
                        child10
                    ),
                    child8
                )
            )
        )
    );
    
    
    child5.add([true, child2]);
    root.log();
    
    
    console.log('---------------');

    root.appendCard();

    
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
                        memory.push(last);
                        if (memory.length > memoryLimit) memory.splice(0, 1);
                        console.log(`adds to memory : ${memory}`);
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
        if (memory.length != 0) {
            let previous = createHTML('li', createHTML('button', 'previous'));
            previous.addEventListener(
                "click",
                function (event) {
                    let prevElement = memory[memory.length - 1];
                    memory.splice(memory.length - 1, 1);
                    NODES[prevElement].appendCard();
                    console.log(`removes from memory : ${memory}`);
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