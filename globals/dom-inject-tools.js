/**
 * If this becomes TRUE, the attempts to inject the tools
 * via "reInjectToolsPeriodically" will be completely stopped.
 */
let isBlockedToolsInjection = false;

/**
 * Get the tools button from the hud-menu, if any
 */
function getToolsButton() {
    const elHudMenu = getElHudMenu();
    if (!elHudMenu) {
        return null;
    }
    return elHudMenu.querySelector(`[data-e115-menu-id="${hudMenuItemLabelTools}"]`);
}

/**
 * Re-inject the tools button periodically into the hud-menu, if needed
 */
function reInjectToolsPeriodically() {
    const injectCondition = setInterval(() => {
        if (isBlockedToolsInjection) {
            // Stop trying to inject the tools
            clearInterval(injectCondition);
            return;
        }
        // Inject the tools button only if not currently injected
        const elToolsButton = getToolsButton();
        if (!elToolsButton) {
            injectTools();
        }
    }, 2000); // same as "maxWaitMs" @ waitForHudMenuItemSelectedState
}

async function injectTools() {
    /**
     * Attempt to inject the tools only after the player is logged-in and clicks "Play".
     * This can be detected based on the number of sub-menus in the VISIBLE hud-menu:
     * - 0 sub-menus if the player is NOT logged-in, and did NOT click "Explore World"
     * - 1 sub-menu if the player is logged-in, and did NOT click "Play"
     * - 2 sub-menus if the player is NOT logged-in, and DID click "Explore World" (NO "My Crews" / "My Assets")
     * - 3 sub-menus if the player is logged-in, and DID click "Play"
     */
    const elHudMenu = getElHudMenu();
    if (!elHudMenu || elHudMenu.children.length < 3) {
        // Not yet logged-in and clicked "Play"
        return;
    }
    // Ensure the default hud-menu item is visible
    const elHudMenuItemDefault = getElHudMenuItemByLabel(hudMenuItemLabelDefault);
    if (!elHudMenuItemDefault || !elHudMenuItemDefault.offsetParent) {
        // Not yet visible
        return;
    }
    const elHudMenuPanel = getElHudMenuPanel();
    if (!elHudMenuPanel) {
        // hud-menu panel NOT found => ABORT
        console.log(`%c--- [injectTools] ABORT re: elHudMenuPanel NOT found`, 'background: orange; color: black');
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
            console.log(`%c--- [injectTools] ABORT re: elHudMenuItemDefault did NOT become selected`, 'background: orange; color: black');
            return;
        }
    }
    // Clone the default hud-menu panel (open, at this point)
    hudMenuPanelOpenClone = elHudMenuPanel.cloneNode(true);
    // Save the class-list for the hud-menu (open, at this point)
    hudMenuOpenClassListValue = elHudMenu.classList.value;
    // Save the class-list for the default hud-menu item (selected, at this point)
    hudMenuItemSelectedClassListValue = elHudMenuItemDefault.classList.value;
    // If tools not yet fetched (async), they need to be fetched now (sync), before continuing
    if (!tools) {
        await updateToolsIfNotSet();
    }
    // Inject the hud-menu item, now that the default hud-menu item is selected
    const elToolsButton = getToolsButton();
    if (!elToolsButton) {
        /**
         * Ensure the hud-menu item was NOT already injected - e.g. by another cycle from
         * "reInjectToolsPeriodically", while this cycle was waiting for the "await" calls?
         * (potential fix for randomly duplicated "Community Tools" hud-menu item)
         */
        injectHudMenuItemAndPanel(hudMenuItemLabelTools, tools);
    }
    // De-select the default hud-menu item, in order to extract the class-list for "hudMenuClosedClassListValue"
    elHudMenuItemDefault.click();
    const targetSelectedStateReached = await waitForHudMenuItemSelectedState(elHudMenuItemDefault, false, checkIntervalMs);
    if (!targetSelectedStateReached) {
        // hud-menu item did NOT become de-selected => ABORT
        console.log(`%c--- [injectTools] ABORT re: elHudMenuItemDefault did NOT become de-selected`, 'background: orange; color: black');
        return;
    }
    // Save the class-list for the hud-menu (closed, at this point)
    hudMenuClosedClassListValue = elHudMenu.classList.value;
    // Revert the hud-menu selection to its initial state
    if (elHudMenuItemPreselected) {
        // Re-select the pre-selected hud-menu item
        elHudMenuItemPreselected.click();
    }
}

/**
 * @param label e.g. "Community Tools"
 * @param list see "tools.js"
 * 
 * NOTE:
 * - When this function is called, the default hud-menu item must be SELECTED.
 * - The operations in this function assume that there will NOT be multiple hud-menu items injected.
 */
function injectHudMenuItemAndPanel(label, list) {
    /**
     * The "My Assets" item will be cloned, instead of the default item,
     * because the default item should be selected at this point (i.e. different DOM classes).
     */
    const elHudMenuItemUnselected = getElHudMenuItemByLabel('My Assets');
    if (!elHudMenuItemUnselected) {
        // NOT possible to inject the new hud-menu item
        return;
    }
    hudMenuItemUnselectedClassListValue = elHudMenuItemUnselected.classList.value;

    /**
     * Attempt to inject the panel BEFORE injecting the menu-item, in case this function aborts early
     * - e.g. during the initial cycle(s) on page-load, while the default-panel is loading.
     * Nothing will be injected if this function aborts early.
     */

    // Process buttons in the hud-menu panel's header
    const hudMenuPanelButtonFirst = hudMenuPanelOpenClone.querySelector('button');
    if (!hudMenuPanelButtonFirst) {
        console.log(`%c--- [injectHudMenuItemAndPanel] ERROR: hudMenuPanelButtonFirst NOT found`, 'background: red');
        return;
    }
    const hudMenuPanelHeader = hudMenuPanelButtonFirst.parentElement;
    // Remove all non-"close" buttons (if any) from the hud-menu panel's header
    while (hudMenuPanelHeader.querySelectorAll('button').length >= 2) {
        const firstButton = hudMenuPanelHeader.querySelector('button');
        firstButton.parentElement.removeChild(firstButton);
    }
    // Handle click on "close" button
    const closeButton = hudMenuPanelHeader.querySelector('button');
    if (!closeButton) {
        console.log(`%c--- [injectHudMenuItemAndPanel] ERROR: closeButton NOT found`, 'background: red');
        return;
    }
    closeButtonClone = closeButton.cloneNode(true); // saved for later use in other logic
    closeButton.dataset.onClickFunction = 'onClickInjectedHudMenuPanelCloseButton';
    closeButton.dataset.onClickArgs = JSON.stringify([label]);
    // Update the title in the hud-menu panel's header
    hudMenuPanelHeader.firstElementChild.textContent = label;
    const hudMenuPanelContent = hudMenuPanelHeader.nextElementSibling;
    // Save various class-lists for the list
    const hudMenuPanelListItemSvg = hudMenuPanelContent.querySelector('svg');
    if (!hudMenuPanelListItemSvg) {
        /**
         * Abort and STOP trying to inject the tools, if the default panel-content is empty.
         * - This is ALWAYS the case if the player does NOT have crews yet.
         * - This may also happen on the initial page-load, even if the player does have crews.
         * 
         * NOTE: If the injection attempts were to continue, "injectTools" would
         * keep force-clicking the menu-items, infinitely toggling the panel on/off.
         */
        console.log(`%c--- [injectHudMenuItemAndPanel] ABORT re: hudMenuPanelListItemSvg NOT found`, 'background: orange; color: black');
        isBlockedToolsInjection = true;
        return;
    }
    const elListItemSvgWrapper = hudMenuPanelListItemSvg.parentElement;
    const listItemSvgWrapperClassListValue = elListItemSvgWrapper.classList.value;
    const listItemLabelWrapperClassListValue = elListItemSvgWrapper.nextElementSibling.classList.value;
    const listItemWrapperClassListValue = elListItemSvgWrapper.parentElement.classList.value;
    // Clone the SVG for list items inside the hud-menu panel's content
    hudMenuPanelListItemSvgClone = hudMenuPanelListItemSvg.cloneNode(true);
    // Empty the hud-menu panel's content, before injecting the list
    hudMenuPanelContent.textContent = '';
    // Inject the list into the hud-menu panel's content
    const elList = createEl('div', null, ['e115-hud-menu-list']);
    list.forEach(listItemData => {
        const elListItem = createEl('div', null, ['e115-hud-menu-list-item']);
        elListItem.innerHTML = /*html*/ `
            <div class="${listItemWrapperClassListValue} e115-category-title e115-cursor-full">
                <div class="${listItemSvgWrapperClassListValue}">${hudMenuPanelListItemSvgClone.outerHTML}</div>
                <div class="${listItemLabelWrapperClassListValue}">${listItemData.category_short.toUpperCase()}</div>
            </div>
            <div class="e115-category-items"></div>
        `;
        elListItem.dataset.e115ListItemCategory = listItemData.category; // data-e115-list-item-category
        elListItem.style.setProperty('--items-count', listItemData.items.length);
        const elCategoryTitle = elListItem.querySelector(".e115-category-title");
        elCategoryTitle.dataset.onClickFunction = 'onClickToolCategoryTitle';
        elCategoryTitle.dataset.onClickArgs = JSON.stringify([listItemData.category]);
        const elCategoryItems = elListItem.querySelector(".e115-category-items");
        // Inject the sub-list of items for the current category
        listItemData.items.forEach(categoryItemData => {
            const elCategoryItem = createEl('div', null, ['e115-category-item', 'e115-cursor-full']);
            elCategoryItem.innerHTML = /*html*/ `
                <div class="e115-category-item-title">${categoryItemData.title}</div>
                <div class="e115-category-item-author">${categoryItemData.author}</div>
            `;
            elCategoryItem.dataset.onClickFunction = 'onClickToolCategoryItem';
            elCategoryItem.dataset.onClickArgs = JSON.stringify([categoryItemData.title, categoryItemData.url, true]);
            elCategoryItems.append(elCategoryItem);
        });
        elList.append(elListItem);
    });
    hudMenuPanelContent.append(elList);

    // Prepare new hud-menu item
    const elNewMenuItem = elHudMenuItemUnselected.cloneNode(true);
    elNewMenuItem.dataset.tooltipContent = label;
    elNewMenuItem.dataset.e115MenuId = label; // data-e115-menu-id
    elNewMenuItem.dataset.e115State = ''; // data-e115-state
    elNewMenuItem.dataset.onClickFunction = 'onClickInjectedHudMenuItem';
    elNewMenuItem.dataset.onClickArgs = JSON.stringify([label]);
    elNewMenuItem.innerHTML = svgIconCommunityTools;
    const elNewMenuItemSvg = elNewMenuItem.querySelector('svg');
    elNewMenuItemSvg.classList.add('icon');
    elNewMenuItemSvg.querySelector('path').removeAttribute('fill');

    // Inject new menu item, as the last item in this sub-menu
    elHudMenuItemUnselected.parentElement.append(elNewMenuItem);
}
