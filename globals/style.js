/**
 * Classes of DOM elements
 */
 const cls = {
    main: ['sc-dNCsYx', 'gglZw'], // has children "cls.standardWindowWrapper", "cls.bottomMenu"
    // Standard window
    standardWindowWrapper: ['sc-jhrdCu', 'faJcWL'],
    standardWindow: ['sc-hjsNop', 'hgtEvr'],
    standardWindowTitle: ['sc-bRlCZA', 'epbBDP'], // h1
    standardWindowClose: ['sc-hHTYSt', 'fAiLNU', 'sc-edLOhm', 'eRqRVr'], // button, has child "svg.e115IconClose"
    // Side menu
    sideMenuPanel: ['sc-jfTVlA', 'joMUIB'],
    sideMenuPanelBar: ['sc-lbVpMG', 'lonsSj'], // has child "svg.e115IconShip"
    sideMenuPanelTitle: ['sc-iOeugr', 'iwOMEl'], // h2
    sideMenuPanelClose: ['sc-hHTYSt', 'fAiLNU', 'sc-jfvxQR', 'ceJfqQ'], // button, has child "svg.e115IconClose"
    sideMenuPanelContent: ['sc-gScZFl', 'egtYcz'],
    // Bottom menu
    bottomMenuWrapper: ['sc-gikAfH', 'dnKgIn'],
    bottomMenuItem: ['sc-kgTSHT', 'bKznIm'],
    bottomMenuItemLabel: ['sc-bBABsx', 'fERzvQ'],
    bottomMenuItemList: ['sc-iveFHk', 'bwpfoI'],
    bottomMenuItemListItem: ['jCUfva'], // has child "svg.e115IconShip" + text
    // etc.
    button: ['laLRQl'],
};

const svg = {
    e115IconShip: `<svg viewBox="0 0 221.73 94.58"><g><g><path fill="#fff" d="M221.73,47.3L110.78,0H0L71.49,30.77l-22.68,16.53,22.68,16.53L0,94.58H110.78l110.95-47.28Z"/></g></g></svg>`,
    e115IconClose: `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>`,
    e115ButtonCorner: `<svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" class="sc-jSUZER ktYJwN e115-button-corner"><line x1="0" y1="10" x2="10" y2="0"></line></svg>`,
};

/**
 * Inject global styles that reproduce the dynamically-injected styles
 * (for dynamically-injected DOM elements) in the game client,
 * as well as custom styles for newly-injected elements.
 */
const elStyleE115 = document.createElement('style');
elStyleE115.innerHTML = /*html*/ `

    /* Dynamic styles */

    .e115-window-wrapper { /* re: standardWindowWrapper */
        flex: 1 1 0px;
        max-width: 1400px;
        padding: 25px 25px 0px;
        position: relative;
        overflow: hidden;
        width: 100%;
    }
    .e115-window { /* re: standardWindow */
        background-color: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(4px);
        clip-path: polygon(0px 0px, 100% 0px, 100% calc(100% - 35px), calc(100% - 35px) 100%, 0px 100%);
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        pointer-events: auto;
    }
    .e115-window-title { /* re: standardWindowTitle */
        border-left: 5px solid rgb(54, 167, 205);
        font-size: 24px;
        font-weight: 400;
        height: 60px;
        line-height: 60px;
        padding: 0px 0px 0px 30px;
        position: relative;
        margin: 0px;
        z-index: 1;
    }
    .e115-window-close { /* re: standardWindowClose */
        position: absolute !important;
        top: 17px;
        right: 20px;
        z-index: 1;
    }
    .e115-side-menu-panel-close { /* re: sideMenuPanelClose */
        position: absolute !important;
        top: 15px;
        right: 10px;
        opacity: 0;
    }
    .${cls.sideMenuPanel[0]}:hover .${cls.sideMenuPanelClose[2]} {
        opacity: 1;
    }
    .e115-side-menu-panel-content { /* re: sideMenuPanelContent */
        max-height: 350px;
        padding-bottom: 20px;
    }

    /* Custom styles */

    :root {
        /* --e115-highlight-red: 63; --e115-highlight-green: 128; --e115-highlight-blue: 234; */ /* blue */
        /* --e115-highlight-red: 223; --e115-highlight-green: 67; --e115-highlight-blue: 0; */ /* red */
        --e115-highlight-red: 163; --e115-highlight-green: 107; --e115-highlight-blue: 247; /* violet */
        --e115-highlight: rgb(var(--e115-highlight-red), var(--e115-highlight-green), var(--e115-highlight-blue));
        --e115-highlight-faded-10: rgba(var(--e115-highlight-red), var(--e115-highlight-green), var(--e115-highlight-blue), 0.1);
        --e115-highlight-faded-15: rgba(var(--e115-highlight-red), var(--e115-highlight-green), var(--e115-highlight-blue), 0.15);
        --e115-highlight-faded-25: rgba(var(--e115-highlight-red), var(--e115-highlight-green), var(--e115-highlight-blue), 0.25);
    }

    .e115-cursor {
        cursor: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFw2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuNSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMTEtMjZUMTc6MjY6MDErMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTExLTI2VDE4OjA5OjI4KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTExLTI2VDE4OjA5OjI4KzAyOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDplZWZhYmUxOS05N2MzLTQ5NzAtYTg0My0xYjk5MmZkZjZlYmQiIHhtcE1NOkRvY3VtZW50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") 5 5, auto;
    }
    .e115-cursor-full,
    .e115-cursor-full a,
    .e115-cursor-full button {
        cursor: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFw2lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OWI0LCAyMDIyLzA2LzEzLTIyOjAxOjAxICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjMuNSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjItMTEtMjZUMTc6MzA6MTYrMDI6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIyLTExLTI2VDE4OjA5OjE3KzAyOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIyLTExLTI2VDE4OjA5OjE3KzAyOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowZWM1Mjk5NS01MDFmLTQwMTgtOWVlZC0wZGJhMmRmMjA2MmQiIHhtcE1NOkRvY3VtZW50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") 5 5, auto;
    }

    /* Fill custom SVG icon */
    [data-e115-menu-id] .e115-bottom-menu-item-list-item svg path {
        fill: rgba(255, 255, 255, 0.75);
    }
    [data-e115-panel-id] .e115-side-menu-panel-bar svg path {
        fill: rgba(255, 255, 255, 0.5);
    }
    [data-e115-panel-id]:hover .e115-side-menu-panel-bar svg path,
    [data-e115-menu-id] .e115-bottom-menu-item-list-item:hover svg path {
        fill: white;
    }

    [data-e115-window-id] .${cls.standardWindowClose[1]}:hover,
    [data-e115-panel-id] .${cls.sideMenuPanelClose[1]}:hover {
        background-image: linear-gradient(120deg, var(--e115-highlight-faded-10), var(--e115-highlight-faded-25));
        color: white;
    }

    .e115-window-header {
        display: flex;
        justify-content: space-between;
        margin-right: 90px;
    }
    .e115-window-header .e115-button {
        height: 35px;
        color: var(--e115-highlight);
        text-decoration: none;
    }
    .e115-window-title {
        border-left-color: var(--e115-highlight);
    }
    .e115-window-close.${cls.standardWindowClose[1]} {
        border-color: var(--e115-highlight);
        color: var(--e115-highlight);
    }
    .e115-window iframe {
        border: none;
        height: 100%;
    }

    .${cls.sideMenuPanel[1]}[data-e115-panel-id]::after {
        background-image: linear-gradient(0.25turn, var(--e115-highlight-faded-15), rgba(0, 0, 0, 0));
    }
    .${cls.sideMenuPanel[0]}[data-e115-panel-id]:hover .${cls.sideMenuPanelBar[0]},
    .${cls.sideMenuPanel[0]}[data-e115-panel-id].e115-hover .${cls.sideMenuPanelBar[0]} {
        background-color: var(--e115-highlight);
    }
    [data-e115-panel-id] .${cls.sideMenuPanelClose[1]} {
        color: var(--e115-highlight);
        border-color: var(--e115-highlight);
    }

    .${cls.bottomMenuItem[0]}[data-e115-menu-id]:hover {
        max-height: 500px;
    }
    .${cls.bottomMenuItem[0]}[data-e115-menu-id]:hover .${cls.bottomMenuItemLabel[0]} {
        border-bottom-color: var(--e115-highlight);
        color: var(--e115-highlight);
    }
    .${cls.bottomMenuItemListItem[0]}[data-e115-submenu-id]:hover {
        background-color: var(--e115-highlight);
    }

    .e115-list {
        list-stye: none;
        margin: 0;
        padding: 0;
    }
    .e115-list li:hover {
        background: var(--e115-highlight-faded-10);
    }
    .e115-list li a {
        display: block;
        padding: 10px;
    }

    .e115-button {
        color: var(--e115-highlight);
        border-color: var(--e115-highlight);
    }
    .e115-button:hover:not(:disabled) {
        background-color: var(--e115-highlight-faded-25);
    }
    .e115-button .e115-button-corner {
        stroke: var(--e115-highlight);
    }

    .e115-faded {
        opacity: 0.5;
    }
`;
document.head.appendChild(elStyleE115);
