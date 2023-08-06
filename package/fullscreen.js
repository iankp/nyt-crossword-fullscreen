(function() {    

    // from https://github.com/ryanodd/nyt-pencil-extension
    console.log("hello");
    function togglePencilButton() {
        console.log("toggling pencil");
        const pencilButtonIcon = document.querySelector(".xwd__toolbar_icon--pencil, .xwd__toolbar_icon--pencil-active");
        const pencilButton = pencilButtonIcon.closest("button");
        pencilButton.click();
    }

    let qs = s => document.querySelector(s);
    let run = () => {
        if (window.hasRun) return; // Ensure this code only runs once
        window.hasRun = true;

        // from https://github.com/ryanodd/nyt-pencil-extension
        try {
            window.addEventListener("keydown", (event) => {
                if (event.code === "ShiftLeft") togglePencilButton();
            });
        } catch (error) {
            console.error("Content-script error:", error);
        }

        // DOM elements
        let container = qs('.pz-content'),
            game = qs('#crossword-container'),

            // Dynamic CSS stylesheets
            scaleStyle = document.head.appendChild(document.createElement('style')).sheet,
            fixStyle = document.head.appendChild(document.createElement('style')).sheet,
            posStyle = document.head.appendChild(document.createElement('style')).sheet,

            // State variables
            fullMode = false,
            ratio = 1;

        // Returns the given css string only if in fullscreen mode
        let css = s => fullMode ? s : 'inherit';

        // Calculates and applies the scale ratio for the game
        let render = () => {
            ratio = container.clientHeight/game.clientHeight;
            game.style.transform = css(`scale(${ratio})`);
            game.style.width = css(`calc(100vw / ${ratio})`);

            if (scaleStyle.cssRules.length > 0) scaleStyle.deleteRule(0);
            if (fullMode) scaleStyle.insertRule('.xwd__rebus--input {' + 
                                                    `transform: scale(${1/ratio});` +
                                                    `font-size: ${22 * ratio}px; }`);                    
        };

        // Toggles fullscreen mode
        let toggleFullscreen = () => {
            fullMode = !fullMode;
            qs('header').style.display = css('none');
            qs('.pz-game-title-bar').style.display = css('none');
            qs('#portal-editorial-content').style.display = css('none');
            qs('footer').style.display = css('none');
            qs('body > div:first-of-type').style.height = css('100vh');
            document.querySelectorAll('.pz-ad-box').forEach(el => el.style.display = css('none'));

            container.style.height = css('100%');
            container.style.display = css('flex');
            container.style.justifyContent = container.style.alignItems = css('center');
            
            game.style.marginTop = css('0');
            qs('.pz-game-toolbar').style.borderTop = css('none');

            if (fixStyle.cssRules.length > 0) fixStyle.deleteRule(0);
            if (fullMode) fixStyle.insertRule('.xwd__rebus--input { position: fixed; }');

            render();
        };
        
        // Adjusts the rebus mode CSS to work in fullscreen
        let fixRebus = () => {
            if (qs('.xwd__rebus--input') === null) return;
            
            let cell = qs('.xwd__cell--selected').getBoundingClientRect();
            let w = cell.width, t = cell.top, l = cell.left,
                r = 1/ratio;

            if (posStyle.cssRules.length > 0) posStyle.deleteRule(0);
            if (fullMode) posStyle.insertRule('.xwd__rebus--input {' + 
                                `top: ${-1 * (w - w * r)/2 + t * r}px !important;` +
                                `left: ${-1 * (w - w * r)/2 + l * r}px !important; }`);
        };

        // Fix the border on the toolbar
        let toolbar = qs('.pz-game-toolbar > .pz-row').style;
        toolbar.background = '#fff';
        toolbar.maxWidth = 'unset';
        toolbar.padding = '0 calc((100% - 1280px)/2)';

        // Get rid of the tooltip on the grid
        qs('#boardTitle').innerHTML = '';

        // Re-render on window resize
        window.onresize = render;

        // Create the full-screen button
        let toolbtn = qs('.xwd__toolbar--tools > div:nth-child(1)'),
            fullbtn = toolbtn.parentNode.insertBefore(toolbtn.cloneNode(true), toolbtn.nextSibling);
        fullbtn.querySelector('i').style.backgroundImage = `url('${chrome.runtime.getURL('fullscreen.svg')}')`;
        fullbtn.querySelector('button').addEventListener('click', toggleFullscreen);

        // Add a fullscreen button to the pause modal
        fullbtn = fullbtn.cloneNode(true);
        fullbtn.style.position = 'absolute';
        fullbtn.style.top = '10px';
        fullbtn.style.left = '10px';
        fullbtn.querySelector('button').style.borderRadius = '4px';
        let icon = fullbtn.querySelector('i').style;
        icon.filter = 'grayscale(1) brightness(0.4)';
        icon.backgroundColor = 'unset';
        
        let addBtn = () => {
            qs('.xwd__modal--content')
                .appendChild(fullbtn.cloneNode(true))
                .querySelector('button').addEventListener('click', toggleFullscreen);
        };

        addBtn();
        new MutationObserver(addBtn).observe(qs('#portal-game-modals'), { childList: true });

        // Stop the invisible rebus div from changing the size of the page
        let rebusFix = document.head.appendChild(document.createElement('style')).sheet;
        rebusFix.insertRule('.xwd__rebus--invisible { display: none; }');
        rebusFix.insertRule('.xwd__rebus--input { text-align: center; }');

        // Correct the position of the rebus box when it appears
        new MutationObserver(fixRebus).observe(qs('.xwd__layout_container > div:first-child'), { childList: true });
    };

    // Initialize when the page content has loaded
    new MutationObserver(run).observe(qs('.pz-game-field'), { childList: true });
    if (qs('.pz-game-field').childNodes[0].tagName == "MAIN") { // game field was already loaded
        console.log("Game field already loaded; calling run");
        run();
    }
})();
