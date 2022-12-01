/**
 * Scripts from "globals" are defined in "manifest.json", as a workaround
 * re: Chrome extension content scripts not supporting modules (import / export).
 */

// Handle onclick events for injected elements
on('click', '[data-on-click-function]', el => {
    const args = JSON.parse(el.dataset.onClickArgs);
    switch (el.dataset.onClickFunction) {
        case 'delSel': delSel(args[0]); break;
        case 'injectSideMenuPanel': injectSideMenuPanel(args[0], args[1]); break;
        case 'injectStandardWindow': injectStandardWindow(args[0], args[1]); break;
    }
});

// Inject the bottom menu item only after the bottom menu is loaded
var existCondition = setInterval(() => {
    const elLastBottomMenuItem = getElLastBottomMenuItem();
    if (elLastBottomMenuItem) {
        clearInterval(existCondition);
        injectBottomMenuItem('Tools', tools);
    }
}, 1000);
