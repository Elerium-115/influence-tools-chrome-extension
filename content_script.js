/**
 * Scripts from "/globals" are defined in "manifest.json", as a workaround
 * re: Chrome extension content scripts not supporting modules (import / export).
 */

// Pre-fetch data from Elerium API
updateCrewmateVideosIfNotSet();
updateToolsIfNotSet();
updateWidgetsIfNotSet();

// Inject config, tools, widgets, features...
injectConfig();
injectRealTime();
reInjectToolsPeriodically();
reInjectWidgetsPeriodically();
injectCaptainVideoOnCrewOpen();
injectFilterOnSelectProcessOpen();
injectProductLinksOnOrdersOpen();

// Handle messages e.g. from widgets iframe
window.addEventListener('message', handleMessage, false);

// Handle onclick events for non-injected hud-menu items => CLOSE the injected hud-menu item
on('click', `${selectorHudMenu} [data-tooltip-id='hudMenuTooltip'][data-tooltip-content]:not([data-e115-menu-id])`, el => {
    // De-select the injected hud-menu item(s)
    document.querySelectorAll('[data-e115-menu-id]').forEach(elInjectedHudMenuItem => {
        const label = elInjectedHudMenuItem.dataset.e115MenuId;
        toggleInjectedMenuItemByLabel(label, false);
    });
});

// Handle onclick events for inventory items in the hud-menu panel
on('click', `${selectorHudMenuPanel} [data-tooltip-id='hudMenuTooltip'][data-tooltip-content]`, el => {
    // Handle via setTimeout, allowing the React property "selected" to change first
    setTimeout(() => onClickInventoryItem(el));
});

// Handle onclick events for extension-config title
on('click', '#e115-config-title', el => {
    onClickConfigTitle();
});

// Handle onclick events for extension-config options
on('click', '#e115-config-options label input', el => {
    onClickConfigOptions(el);
});

// Handle click events for injected elements
on('click', '[data-on-click-function]', el => {
    const args = el.dataset.onClickArgs ? JSON.parse(el.dataset.onClickArgs) : [];
    switch (el.dataset.onClickFunction) {
        case 'onClickInjectedHudMenuItem': onClickInjectedHudMenuItem(args[0]); break;
        case 'onClickInjectedHudMenuPanelCloseButton': onClickInjectedHudMenuPanelCloseButton(args[0]); break;
        case 'onClickCategoryTitle': onClickCategoryTitle(args[0]); break;
        case 'onClickCategoryItem': onClickCategoryItem(args[0], args[1]); break;
        case 'onClickNewWindowClose': onClickNewWindowClose(args[0]); break;
        case 'searchMarketplace': searchMarketplace(args[0]); break;
    }
});
