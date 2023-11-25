/**
 * Scripts from "/globals" are defined in "manifest.json", as a workaround
 * re: Chrome extension content scripts not supporting modules (import / export).
 */

// Inject the hud-menu item only after the hud-menu is loaded and visible
const existCondition = setInterval(async () => {
    /**
     * Wait for the default hud-menu item ("System Search") to become visible.
     * Source: https://stackoverflow.com/a/21696585
     */
    const elHudMenuItemDefault = getElHudMenuItemByLabel(defaultHudMenuItemLabel);
    if (!elHudMenuItemDefault || !elHudMenuItemDefault.offsetParent) {
        // Not yet visible
        return;
    }
    // Stop waiting
    clearInterval(existCondition);
    // Ensure reactProps can be accessed
    const hudMenuItemDefaultReactProps = getReactPropsForEl(elHudMenuItemDefault);
    if (!hudMenuItemDefaultReactProps) {
        // reactProps can NOT be accessed => ABORT
        console.log(`%c--- ABORT re: reactProps can NOT be accessed`, 'background: orange; color: black');
        return;
    }
    const elHudMenuPanel = getElHudMenuPanel();
    if (!elHudMenuPanel) {
        // hud-menu panel NOT found => ABORT
        console.log(`%c--- ABORT re: elHudMenuPanel NOT found`, 'background: orange; color: black');
        return;
    }
    /**
     * Wait using a very short "checkIntervalMs" during these initializations,
     * to "hide" the forced selections / de-selections, as much as possible.
     */
    const checkIntervalMs = 10;
    // Get the pre-selected hud-menu item, if any
    const elHudMenuItemPreselected = getElHudMenuItemSelected();
    if (elHudMenuItemDefault !== elHudMenuItemPreselected) {
        /**
         * The default hud-menu item is NOT pre-selected.
         * Select the default hud-menu item, in order to trigger the default hud-menu panel.
         */
        elHudMenuItemDefault.click();
        const targetSelectedStateReached = await waitForHudMenuItemSelectedState(elHudMenuItemDefault, true, checkIntervalMs);
        if (!targetSelectedStateReached) {
            // hud-menu item did NOT become selected => ABORT
            console.log(`%c--- ABORT re: elHudMenuItemDefault did NOT become selected`, 'background: orange; color: black');
            return;
        }
    }
    // Clone the default hud-menu panel (open, at this point)
    hudMenuPanelOpenClone = elHudMenuPanel.cloneNode(true);
    const elHudMenu = getElHudMenu();
    // Save the class-list for the hud-menu (open, at this point)
    hudMenuOpenClassListValue = elHudMenu.classList.value;
    // Save the class-list for the default hud-menu item (selected, at this point)
    hudMenuItemSelectedClassListValue = elHudMenuItemDefault.classList.value;
    // Inject the hud-menu item, now that the default hud-menu item is selected
    injectHudMenuItemAndPanel('Tools', tools);
    // De-select the default hud-menu item, in order to extract the class-list for "hudMenuClosedClassListValue"
    elHudMenuItemDefault.click();
    const targetSelectedStateReached = await waitForHudMenuItemSelectedState(elHudMenuItemDefault, false, checkIntervalMs);
    if (!targetSelectedStateReached) {
        // hud-menu item did NOT become de-selected => ABORT
        console.log(`%c--- ABORT re: elHudMenuItemDefault did NOT become de-selected`, 'background: orange; color: black');
        return;
    }
    // Save the class-list for the hud-menu (closed, at this point)
    hudMenuClosedClassListValue = elHudMenu.classList.value;
    // Revert the hud-menu selection to its initial state
    if (elHudMenuItemPreselected) {
        // Re-select the pre-selected hud-menu item
        elHudMenuItemPreselected.click();
    }
}, 1000);

// Handle onclick events for non-injected hud-menu items => CLOSE the injected hud-menu item
on('click', `#hudMenu + div [data-for='hudMenu'][data-tip]:not([data-e115-menu-id])`, el => {
    // De-select the injected hud-menu item(s)
    document.querySelectorAll('[data-e115-menu-id]').forEach(elInjectedHudMenuItem => {
        const label = elInjectedHudMenuItem.dataset.e115MenuId;
        toggleInjectedMenuItemByLabel(label, false);
    });
});

// Handle onclick events for injected elements
on('click', '[data-on-click-function]', el => {
    const args = JSON.parse(el.dataset.onClickArgs);
    switch (el.dataset.onClickFunction) {
        case 'onClickInjectedHudMenuItem': onClickInjectedHudMenuItem(args[0]); break;
        case 'onClickInjectedHudMenuPanelCloseButton': onClickInjectedHudMenuPanelCloseButton(args[0]); break;
        case 'onClickCategoryTitle': onClickCategoryTitle(args[0]); break;
        case 'onClickCategoryItem': onClickCategoryItem(args[0], args[1]); break;
        case 'onClickNewWindowClose': onClickNewWindowClose(args[0]); break;
    }
});
