(function () {
    const mainContainer = document.querySelector("html");
    const openMenu = document.querySelector(".js-open-menu");
    const closeMenu = document.querySelector(".js-close-menu");
    const menuTriggers = [openMenu, closeMenu];




    // SETS MENU
    menuTriggers.forEach(function (trigger) {
    trigger.addEventListener(
        "click",
        function (event) {
        event.preventDefault();
        mainContainer.classList.toggle("has-menu");
        },
        false
    );
    });

    document.querySelectorAll(".js-closenav-onclick").forEach(function (trigger) {
    trigger.addEventListener(
        "click",
        function (event) {
            // annuler le comporetement par défaut du lien
            // event.preventDefault();
            // ajouter / supprimer la classe en fonction du fait qu'elle existe ou pas
            mainContainer.classList.toggle("has-menu");
        },
        false
    );
    });


    // DRAWTHISINYOURSTYLE
    // js is active : disables the default css with :hover by putting .js-active class
    let verticalart = document.querySelector(".js-verticalart");
    if (verticalart != null) {
        verticalart.classList.add("js-active");

        document.querySelectorAll(".js-btn-verticalarts").forEach (function (trigger) {

            // only one button is checked at the time
            trigger.addEventListener(
                "click",
                function (event) {
    
                    // unchecks already checked trigger
                    if (trigger.classList.contains("is-checked")) {
                        trigger.classList.remove("is-checked");
                    } else {
    
                        // unckecks all and checks only the current trigger
                        document.querySelectorAll(".js-btn-verticalarts").forEach(function (trigger) {trigger.classList.remove("is-checked")});
                        trigger.classList.add("is-checked");
                    }
                    // trigger.classList.toggle("is-checked");
                }
            );
        });
    }

})();

/**
 * Themes management
 */

(function () {
    const mainContainer = document.querySelector("html");

    const themes = [
        "theme-light",
        "theme-dark"
    ];

    // SET THEME LIGHT AND DARK
    setTheme();

    // SETS THEME TOGGLE BUTTON
    document.querySelector(".js-theme").addEventListener(
        "click",
        function(event) {
            event.preventDefault();
            toggleTheme(themes, mainContainer);
        }
    );

    document.querySelector(".js-remove-theme").addEventListener(
        "click",
        function (event) {
            event.preventDefault();
            reinitTheme(themes, mainContainer);
        }
    );

    function toggleTheme(themes, mainContainer) {
        let hasChanged = false;

        for (let i = 0; i < themes.length; i++) {
            if (!hasChanged && (localStorage.getItem("angelscape-theme") == themes[i])) {
                mainContainer.classList.remove(themes[i]);
                if (i == (themes.length - 1)) var j = 0;
                else var j = i + 1;
                localStorage.setItem("angelscape-theme", themes[j]);
                mainContainer.classList.add(themes[j]);

                hasChanged = true;
            } 
        }

        // if preferences werent set before, will always go there
        if (!hasChanged) {

            // checks prefered color scheme
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                mainContainer.classList.add(themes[0]);
                localStorage.setItem("angelscape-theme", themes[0]);
            } else {
                mainContainer.classList.add(themes[1]);
                localStorage.setItem("angelscape-theme", themes[1]);
            }
        }
    }

    function reinitTheme(themes, mainContainer) {
        localStorage.removeItem("angelscape-theme");
        mainContainer.classList.remove();
        
        for (theme of themes) mainContainer.classList.remove(theme);
    }

    function setTheme() {
        for (theme of themes) {
            if (localStorage.getItem("angelscape-theme") == theme)
                mainContainer.classList.add(theme);
            else
                mainContainer.classList.remove(theme);
        }
    }
})();






(function() {
    const allPlayers = document.querySelectorAll(".js-audioplayer");

    function stopActivePlayers() {
        const activePlayers = document.querySelectorAll(".js-audioplayer.is-playing");

        activePlayers.forEach(function (player) {
            const audio = player.querySelector("audio");
            player.classList.remove("is-playing");
            audio.pause();
        });
    }

    allPlayers.forEach(function(player) {
        let button = player.querySelector(".js-btn");
        let audio = player.querySelector("audio");

        // listens for click on play button
        button.addEventListener("click", function (event) {
            
            console.log(player.classList);
            if (player.classList.contains("is-playing")) {
                stopActivePlayers();
            } else {
                stopActivePlayers();
                player.classList.add("is-playing");
                audio.play();
            }
        });

        audio.addEventListener("ended", function (event) {
            player.classList.remove("is-playing");
        });
    });
})();