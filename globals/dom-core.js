const svgIconCommunityTools = `<svg class="e115-icon-community-tools" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><path d="m700.36 208.62c37.5 9.5859 72.898 24.438 105.38 43.699l131.9-95.5 105.54 105.54-95.5 131.9c19.262 32.477 34.102 67.875 43.688 105.38l160.75 25.738v149.25l-160.74 25.738c-9.5859 37.5-24.438 72.898-43.699 105.38l95.5 131.9-105.54 105.54-131.9-95.5c-32.477 19.262-67.875 34.102-105.38 43.688l-25.738 160.75h-149.25l-25.738-160.74c-37.5-9.5859-72.898-24.438-105.38-43.699l-131.9 95.5-105.54-105.54 95.5-131.9c-19.262-32.477-34.102-67.875-43.688-105.38l-160.75-25.738v-149.25l160.75-25.738c9.5859-37.5 24.426-72.898 43.688-105.38l-95.5-131.9 105.54-105.54 131.9 95.5c32.477-19.262 67.875-34.102 105.38-43.688l25.738-160.75h149.25zm-100.36 120.89c-149.39 0-270.49 121.1-270.49 270.49 0 67.926 25.051 130 66.398 177.51 27.125-86.938 108.24-150.07 204.1-150.07 95.875 0 176.99 63.125 204.1 150.07 41.352-47.5 66.398-109.59 66.398-177.51-0.023438-149.39-121.12-270.49-270.51-270.49zm0-35.625c-169.06 0-306.11 137.05-306.11 306.11s137.05 306.11 306.11 306.11 306.11-137.05 306.11-306.11-137.05-306.11-306.11-306.11zm0 103.31c-59.688 0-108.09 48.387-108.09 108.07s48.387 108.07 108.09 108.07c59.688 0 108.07-48.387 108.07-108.07s-48.375-108.07-108.07-108.07z" fill-rule="evenodd"/></svg>`;

/**
 * The default hud-menu item is "System Search", because this item is always available,
 * even if the user is not logged-in, and no asteroid is pre-selected.
 */
const defaultHudMenuItemLabel = 'System Search';

const toolsEndpoint = 'https://elerium-influence-api.vercel.app/data/tools';
const widgetsEndpoint = 'https://elerium-influence-api.vercel.app/data/widgets';

/**
 * This will be populated via API call to "toolsEndpoint"
 */
let tools = null;

/**
 * This will be populated via API call to "widgetsEndpoint"
 */
let widgets = null;

/**
 * This will contain a cloned DOM element for the hud-menu panel in an open state
 */
let hudMenuPanelOpenClone = null;

/**
 * This will contain a cloned DOM element (SVG) for the "arrow" next to a list-item in the hud-menu panel
 */
let hudMenuPanelListItemSvgClone = null;

/**
 * This will contain a cloned DOM element for a "close" button
 */
let closeButtonClone = null;

/**
 * This will be set to the class-list value (string, NOT DOMTokenList) of the hud-menu with a selected hud-menu item
 */
let hudMenuOpenClassListValue = null;

/**
 * This will be set to the class-list value (string, NOT DOMTokenList) of the hud-menu with NO selected hud-menu item
 */
let hudMenuClosedClassListValue = null;

/**
 * This will be set to the class-list value (string, NOT DOMTokenList) of a selected hud-menu item
 */
let hudMenuItemSelectedClassListValue = null;

/**
 * This will be set to the class-list value (string, NOT DOMTokenList) of an unselected hud-menu item
 */
let hudMenuItemUnselectedClassListValue = null;

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getReactPropsForEl(el) {
    const reactPropsKey = Object.keys(el).find(key => key.includes('__reactProps'));
    if (!reactPropsKey) {
        console.log(`%c--- [getReactPropsForEl] ERROR: reactPropsKey not found for el:`, 'background: red', el);
        return null;
    }
    return el[reactPropsKey];
}

function getElHudMenu() {
    const elHudMenu = document.querySelector(`#hudMenu + div`);
    if (!elHudMenu) {
        console.log(`%c--- [getElHudMenu] ERROR: elHudMenu not found`, 'background: red');
    }
    return elHudMenu;
}

function getElHudMenuPanel() {
    const elHudMenuPanel = document.querySelector(`#hudMenu + div + div`);
    if (!elHudMenuPanel) {
        console.log(`%c--- [getElHudMenuPanel] ERROR: elHudMenuPanel not found`, 'background: red');
    }
    return elHudMenuPanel;
}

function getElHudMenuItemByLabel(label) {
    const elHudMenu = getElHudMenu();
    if (!elHudMenu) {
        return null;
    }
    return elHudMenu.querySelector(`[data-for='hudMenu'][data-tip='${label}']`);
}

function getElHudMenuItemSelected() {
    const elHudMenu = getElHudMenu();
    if (!elHudMenu) {
        return null;
    }
    for (const elHudMenuItem of elHudMenu.children) {
        if (elHudMenuItem.dataset.e115MenuId) {
            // Parsing an injected hud-menu item
            if (elHudMenuItem.dataset.e115State === 'selected') {
                return elHudMenuItem;
            }
        } else {
            // Parsing a non-injected hud-menu item
            const reactProps = getReactPropsForEl(elHudMenuItem);
            if (reactProps && reactProps.selected) {
                return elHudMenuItem;
            }
        }
    }
    return null;
}

/**
 * Return TRUE if the "targetSelectedState" has been reached, or FALSE otherwise / on timeout
 */
async function waitForHudMenuItemSelectedState(el, targetSelectedState, checkIntervalMs = 250, maxWaitMs = 2000) {
    const checkAttempts = maxWaitMs / checkIntervalMs;
    for (i = 0; i < checkAttempts ; i++) {
        /**
         * Always wait first, before checking the selected-state.
         * This ensures that any CSS transitions are visible, at least partially.
         */
        await delay(checkIntervalMs);
        const reactProps = getReactPropsForEl(el);
        if (!reactProps) {
            return false;
        }
        if (reactProps.selected === targetSelectedState) {
            return true;
        }
    }
    return false;
}

function createEl(nodeType, classes = null) {
    const el = document.createElement(nodeType);
    if (classes) {
        classes.forEach(className => el.classList.add(className));
    }
    return el;
}

function injectUrlParam(url, key, value) {
    const urlData = new URL(url);
    const urlParams = new URLSearchParams(urlData.search);
    urlParams.set(key, value);
    urlData.search = urlParams.toString();
    return urlData.href;
}

function onClickCategoryItem(title, url) {
    // Check if window already exists with the same "title"
    const elMatchingWindow = document.querySelector(`[data-e115-window-id="${title}"]`);
    if (elMatchingWindow) {
        return;
    }
    // Close any injected window (but keep any official window)
    const elOldWindowClose = document.querySelector('.e115-window-close');
    if (elOldWindowClose) {
        elOldWindowClose.click();
    }
    // Prepare new standard window > wrapper
    const elNewWindowWrapper = createEl('div', ['e115-window-wrapper']);
    elNewWindowWrapper.dataset.e115WindowId = title; // data-e115-window-id
    // Prepare new standard window
    const elNewWindow = createEl('div', ['e115-window']);
    elNewWindowWrapper.appendChild(elNewWindow);
    // Prepare new standard window > header
    const elNewWindowHeader = createEl('div', ['e115-window-header']);
    elNewWindow.appendChild(elNewWindowHeader);
    // Prepare new standard window > header > title
    const elNewWindowHeaderTitle = createEl('h1', ['e115-window-title']);
    elNewWindowHeaderTitle.textContent = title;
    elNewWindowHeader.appendChild(elNewWindowHeaderTitle);
    // Prepare new standard window > header > buttons-wrapper
    const elNewWindowHeaderButtons = createEl('div');
    elNewWindowHeaderButtons.classList.add('e115-window-buttons');
    elNewWindowHeader.appendChild(elNewWindowHeaderButtons);
    // Prepare new standard window > header > buttons-wrapper > "Safety Tips"
    const elNewWindowHeaderWarning = createEl('div', ['e115-button', 'e115-cursor-full']);
    elNewWindowHeaderWarning.textContent = 'Safety Tips';
    elNewWindowHeaderWarning.setAttribute('onmouseenter', 'toggleSafetyTips(true)');
    elNewWindowHeaderWarning.setAttribute('onmouseleave', 'toggleSafetyTips(false)');
    elNewWindowHeaderButtons.appendChild(elNewWindowHeaderWarning);
    // Prepare new standard window > header > buttons-wrapper > "Open in new window"
    const elNewWindowHeaderButton = createEl('a', ['e115-button', 'e115-cursor-full']);
    elNewWindowHeaderButton.href = url;
    elNewWindowHeaderButton.target = '_blank';
    elNewWindowHeaderButton.textContent = 'Open in new window';
    elNewWindowHeaderButtons.appendChild(elNewWindowHeaderButton);
    // Prepare new standard window > header > buttons-wrapper > close
    const elNewWindowClose = closeButtonClone.cloneNode(true);
    elNewWindowClose.classList.add('e115-window-close'); // class used for closing the injected window
    // Define onclick handler to delete this window
    elNewWindowClose.dataset.onClickFunction = 'onClickNewWindowClose';
    elNewWindowClose.dataset.onClickArgs = JSON.stringify([title]);
    elNewWindowHeaderButtons.appendChild(elNewWindowClose);
    // Prepare new standard window > content > Safety Tips
    const elNewWindowSafety = createEl('div', ['e115-window-content', 'e115-window-safety', 'e115-hidden']);
    elNewWindowSafety.innerHTML = /*html*/ `
        <h2>Safety Tips</h2>
        <ul>
            <li>This tool is embedded from a third-party website, without any guarantees, and beyond the control of <span class="e115-color-influence">${location.hostname}</span>.</li>
            <li>This embedded tool may trigger requests to your L1 and/or L2 wallet, but it does NOT have access to your game account.</li>
            <li>Ensure that you fully understand the origin and impact of any wallet request, before you approve it!</li>
        </ul>
    `;
    elNewWindow.appendChild(elNewWindowSafety);
    // Prepare new standard window > content > iframe
    const elNewWindowIframe = createEl('iframe', ['e115-window-content']);
    let iframeUrl = url;

    //// TO DO: rework this via asteroid ID = "JSON.parse(localStorage.influence).state.asteroids.origin"
    //// ...
    // Inject ID of selected asteroid (if any) into the iframe URL
    const asteroidMatches = location.pathname.match(/\/asteroids\/(\d+)/);
    if (asteroidMatches) {
        iframeUrl = injectUrlParam(iframeUrl, 'influence_asteroid', asteroidMatches[1]);

        //// TO DO: rework this if possible
        //// ...
        // // Also inject spectral type of selected asteroid into the iframe URL
        // const elSpectralType = document.querySelector('svg text[data-name*="-type"]');
        // if (elSpectralType) {
        //     const spectralType = elSpectralType.dataset.name.replace(/^(\w+)-type$/, '$1');
        //     iframeUrl = injectUrlParam(iframeUrl, 'influence_asteroid_type', spectralType.toUpperCase());
        // }
    }

    //// TO DO: rework as "crewmate" or remove completely?
    //// ...
    // // Inject ID of selected crew (if any) into the iframe URL
    // const crewMatches = location.pathname.match(/\/crew\/(\d+)/);
    // if (crewMatches) {
    //     iframeUrl = injectUrlParam(iframeUrl, 'influence_crew', crewMatches[1]);
    // }

    elNewWindowIframe.src = iframeUrl;
    elNewWindow.appendChild(elNewWindowIframe);
    // Inject new standard window, as the first element in the "grand-parent" of the hud-menu
    const elHudMenu = getElHudMenu();
    const elWindowParent = elHudMenu.parentElement.parentElement;
    elWindowParent.prepend(elNewWindowWrapper);
}

function toggleSafetyTips(shouldBeVisible) {
    const elWindow = document.querySelector('.e115-window');
    if (!elWindow) {
        return;
    }
    if (shouldBeVisible) {
        elWindow.querySelector('iframe').classList.add('e115-hidden');
        elWindow.querySelector('.e115-window-safety').classList.remove('e115-hidden');
    } else {
        elWindow.querySelector('.e115-window-safety').classList.add('e115-hidden');
        elWindow.querySelector('iframe').classList.remove('e115-hidden');
    }
}

function onClickNewWindowClose(title) {
    // Delete the injected window
    const el = document.querySelector(`[data-e115-window-id='${title}']`);
    el.parentElement.removeChild(el);
}

function onClickCategoryTitle(category) {
    const elListItem = document.querySelector(`[data-e115-list-item-category="${category}"]`);
    if (!elListItem) {
        return;
    }
    const elListItemSelected = document.querySelector(`[data-e115-list-item-category].selected`);
    if (elListItemSelected && elListItemSelected !== elListItem) {
        // Another category currently selected => deselect it first
        elListItemSelected.classList.remove('selected');
    }
    elListItem.classList.toggle('selected');
}

function onClickInjectedHudMenuItem(label) {
    const elInjectedHudMenuItem = getElHudMenuItemByLabel(label);
    if (elInjectedHudMenuItem.dataset.e115State === 'selected') {
        // De-select the injected hud-menu item
        toggleInjectedMenuItemByLabel(label, false);
    } else {
        // Select the injected hud-menu item
        toggleInjectedMenuItemByLabel(label, true);
    }
}

function onClickInjectedHudMenuPanelCloseButton(label) {
    // De-select the injected hud-menu item
    toggleInjectedMenuItemByLabel(label, false);
}

async function toggleInjectedMenuItemByLabel(label, shouldBeSelected) {
    const elInjectedHudMenuItem = getElHudMenuItemByLabel(label);
    const elHudMenu = getElHudMenu();
    if (shouldBeSelected) {
        if (elInjectedHudMenuItem.dataset.e115State === 'selected') {
            // Abort if already selected
            return;
        }
        // De-select any non-injected hud-menu item, if currently selected
        const elHudMenuItemSelected = getElHudMenuItemSelected();
        if (elHudMenuItemSelected) {
            elHudMenuItemSelected.click();
            const targetSelectedStateReached = await waitForHudMenuItemSelectedState(elHudMenuItemSelected, false);
            if (!targetSelectedStateReached) {
                // hud-menu item did NOT become de-selected => ABORT
                console.log(`%c--- ABORT re: elHudMenuItemSelected did NOT become de-selected`, 'background: orange; color: black');
                return;
            }
        }
        elInjectedHudMenuItem.dataset.e115State = 'selected'; // data-e115-state
        elInjectedHudMenuItem.classList.value = hudMenuItemSelectedClassListValue;
        const elHudMenuPanel = getElHudMenuPanel();
        // The real hud-menu panel (closed, at this point) must be completely hidden
        elHudMenuPanel.style.display = 'none';
        // Inject the cloned hud-menu panel into the DOM
        elHudMenuPanel.parentElement.appendChild(hudMenuPanelOpenClone);
        // Mark the hud-menu as open
        elHudMenu.classList.value = hudMenuOpenClassListValue;
    } else {
        if (elInjectedHudMenuItem.dataset.e115State !== 'selected') {
            // Abort if already de-selected
            return;
        }
        elInjectedHudMenuItem.dataset.e115State = ''; // data-e115-state
        elInjectedHudMenuItem.classList.value = hudMenuItemUnselectedClassListValue;
        const elHudMenuPanel = getElHudMenuPanel();
        // Remove the cloned hud-menu panel from the DOM
        elHudMenuPanel.parentElement.removeChild(hudMenuPanelOpenClone);
        // The real hud-menu panel must no longer be completely hidden
        elHudMenuPanel.style.removeProperty('display');
        // Mark the hud-menu as closed
        elHudMenu.classList.value = hudMenuClosedClassListValue;
        return;
    }
}

/**
 * @param label e.g. "Community Tools"
 * @param list see "tools.js"
 * 
 * NOTE: When this function is called, the default hud-menu item must be SELECTED
 */
function injectHudMenuItemAndPanel(label, list) {
    /**
     * The "Advanced Search" item will be cloned, instead of the default item ("System Search"),
     * because the default item should be selected at this point (i.e. different DOM classes).
     */
    const elHudMenuItemUnselected = getElHudMenuItemByLabel('Advanced Search');
    // Check if it will be possible to inject the new hud-menu item
    if (!elHudMenuItemUnselected) {
        return;
    }
    hudMenuItemUnselectedClassListValue = elHudMenuItemUnselected.classList.value;

    // Prepare new hud-menu item
    const elNewMenuItem = elHudMenuItemUnselected.cloneNode(true);
    elNewMenuItem.dataset.tip = label;
    elNewMenuItem.dataset.e115MenuId = label; // data-e115-menu-id
    elNewMenuItem.dataset.e115State = ''; // data-e115-state
    elNewMenuItem.dataset.onClickFunction = 'onClickInjectedHudMenuItem';
    elNewMenuItem.dataset.onClickArgs = JSON.stringify([label]);
    elNewMenuItem.innerHTML = svgIconCommunityTools;
    const elNewMenuItemSvg = elNewMenuItem.querySelector('svg');
    elNewMenuItemSvg.classList.add('icon');
    elNewMenuItemSvg.querySelector('path').removeAttribute('fill');

    /**
     * Inject new menu item, BEFORE the first menu item.
     * This ensures that the injected item remains the first item,
     * after e.g. switching to / from an asteroid view.
     */
    elHudMenuItemUnselected.parentElement.prepend(elNewMenuItem);

    // NOTE: The operations below assume that there will NOT be multiple hud-menu items injected

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
    closeButtonClone = closeButton.cloneNode(true);
    closeButton.dataset.onClickFunction = 'onClickInjectedHudMenuPanelCloseButton';
    closeButton.dataset.onClickArgs = JSON.stringify([label]);
    // Update the title in the hud-menu panel's header
    hudMenuPanelHeader.firstElementChild.textContent = label;
    const hudMenuPanelContent = hudMenuPanelHeader.nextElementSibling;
    // Save various class-lists for the list
    const hudMenuPanelListItemSvg = hudMenuPanelContent.querySelector('svg');
    const elListItemSvgWrapper = hudMenuPanelListItemSvg.parentElement;
    const listItemSvgWrapperClassListValue = elListItemSvgWrapper.classList.value;
    const listItemLabelWrapperClassListValue = elListItemSvgWrapper.nextElementSibling.classList.value;
    const listItemWrapperClassListValue = elListItemSvgWrapper.parentElement.classList.value;
    // Clone the SVG for list items inside the hud-menu panel's content
    hudMenuPanelListItemSvgClone = hudMenuPanelListItemSvg.cloneNode(true);
    // Empty the hud-menu panel's content, before injecting the list
    hudMenuPanelContent.textContent = '';
    // Inject the list into the hud-menu panel's content
    const elList = createEl('div', ['e115-hud-menu-list']);
    list.forEach(listItemData => {
        const elListItem = createEl('div', ['e115-hud-menu-list-item']);
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
        elCategoryTitle.dataset.onClickFunction = 'onClickCategoryTitle';
        elCategoryTitle.dataset.onClickArgs = JSON.stringify([listItemData.category]);
        const elCategoryItems = elListItem.querySelector(".e115-category-items");
        // Inject the sub-list of items for the current category
        listItemData.items.forEach(categoryItemData => {
            const elCategoryItem = createEl('div', ['e115-category-item', 'e115-cursor-full']);
            elCategoryItem.innerHTML = /*html*/ `
                <div class="e115-category-item-title">${categoryItemData.title}</div>
                <div class="e115-category-item-author">${categoryItemData.author}</div>
            `;
            elCategoryItem.dataset.onClickFunction = 'onClickCategoryItem';
            elCategoryItem.dataset.onClickArgs = JSON.stringify([categoryItemData.title, categoryItemData.url]);
            elCategoryItems.appendChild(elCategoryItem);
        });
        elList.appendChild(elListItem);
    });
    hudMenuPanelContent.appendChild(elList);
}

async function updateToolsIfNotSet() {
    if (tools) {
        return;
    }
    try {
        const toolsResponse = await fetch(toolsEndpoint);
        tools = await toolsResponse.json();
    } catch (error) {
        // Swallow this error
    }
}

async function updateWidgetsIfNotSet() {
    if (widgets) {
        return;
    }
    try {
        const widgetsResponse = await fetch(widgetsEndpoint);
        widgets = await widgetsResponse.json();
    } catch (error) {
        // Swallow this error
    }
}

async function injectWidgets() {
    // Inject the widgets button only after the realign-camera button is loaded and visible
    const existCondition2 = setInterval(async () => {
        // Wait for the realign-camera button to become visible.
        const elButtonRealignCamera = document.querySelector('button[data-tip="Realign camera to poles"]');
        if (!elButtonRealignCamera || !elButtonRealignCamera.offsetParent) {
            // Not yet visible
            return;
        }
        // Stop waiting
        clearInterval(existCondition2);
        // Prepare widgets wrapper
        const elWidgetsWrapper = createEl('div', ['e115-widgets-wrapper', 'e115-cursor-full']);
        elWidgetsWrapper.innerHTML = /*html*/ `
            <div class="e115-widgets-header">
                <div class="e115-widgets-title">Community Widgets</div>
                ${svgIconCommunityTools}
            </div>
            <div class="e115-widgets-content">
                <div class="e115-widgets-selector">
                    <div class="e115-widgets-drag"></div>
                    <div class="e115-widgets-list">
                        <ul></ul>
                    </div>
                </div>
                <iframe allow="clipboard-write"></iframe>
            </div>
        `;
        const elWidgetsHeader = elWidgetsWrapper.querySelector('.e115-widgets-header');
        elWidgetsHeader.setAttribute('onclick', 'toggleWidgets()');
        // Adjust widgets icon styling
        const elWidgetsIcon = elWidgetsWrapper.querySelector('.e115-icon-community-tools');
        elWidgetsIcon.classList.add('icon');
        // If widgets not yet fetched (async), they need to be fetched now (sync), before continuing
        if (!widgets) {
            await updateWidgetsIfNotSet();
        }
        let iframeUrl = null;
        if (widgets) {
            // Inject items into widgets list
            const elWidgetsList = elWidgetsWrapper.querySelector('.e115-widgets-list ul');
            widgets.forEach(widget => {
                const elListItem = document.createElement('li');
                elListItem.textContent = widget.title;
                elListItem.dataset.title = widget.title;
                elListItem.setAttribute('onclick', `selectWidget('${widget.title}')`);
                if (widget.default) {
                    // Preselect default widget
                    elListItem.classList.add('active');
                    iframeUrl = widget.url;
                }
                elWidgetsList.appendChild(elListItem);
            });
        }
        // Inject widgets wrapper, before the realign-camera button
        elButtonRealignCamera.parentElement.insertBefore(elWidgetsWrapper, elButtonRealignCamera);
        // Post-injection actions
        // -- make the widgets draggable
        initDragWidgetsContent();
        // -- preload default widget in iframe
        loadWidgetIframe(iframeUrl);
    }, 1000);
}

function loadWidgetIframe(url) {
    if (!url) {
        return;
    }
    const elWidgetsWrapper = document.querySelector('.e115-widgets-wrapper');
    if (!elWidgetsWrapper) {
        return;
    }
    const elWidgetIframe = elWidgetsWrapper.querySelector('iframe');
    elWidgetIframe.src = url;
}

function toggleWidgets() {
    const elWidgetsWrapper = document.querySelector('.e115-widgets-wrapper');
    if (!elWidgetsWrapper) {
        return;
    }
    elWidgetsWrapper.classList.toggle('active');
    // Pin widgets above other game-windows (e.g. marketplace) if active
    elWidgetsWrapper.parentElement.classList.toggle('e115-widgets-pinned', elWidgetsWrapper.classList.contains('active'));
}

function selectWidget(title) {
    const elWidgetsWrapper = document.querySelector('.e115-widgets-wrapper');
    if (!elWidgetsWrapper) {
        return;
    }
    const elWidgetsList = elWidgetsWrapper.querySelector('.e115-widgets-list');
    elWidgetsList.querySelector(`li.active`).classList.remove('active');
    elWidgetsList.querySelector(`li[data-title="${title}"]`).classList.add('active');
    if (!widgets) {
        return;
    }
    const widget = widgets.find(widget => widget.title === title);
    if (widget) {
        loadWidgetIframe(widget.url);
    }
}

// Source: https://stackoverflow.com/a/45831670
function initDragWidgetsContent() {
    const elWidgetsContent = document.querySelector('.e115-widgets-content');
    if (!elWidgetsContent) {
        return;
    }
    const elWidgetsDrag = elWidgetsContent.querySelector('.e115-widgets-drag');
    const initialLeft = parseInt(getComputedStyle(elWidgetsContent).left);
    const initialTop = parseInt(getComputedStyle(elWidgetsContent).top);
    let isDown = false;
    let offsetX = 0;
    let offsetY = 0;
    elWidgetsDrag.addEventListener('mousedown', e => {
        elWidgetsContent.classList.add('dragging');
        isDown = true;
        offsetX = elWidgetsContent.offsetLeft - e.clientX;
        offsetY = elWidgetsContent.offsetTop - e.clientY;
    }, true);
    document.addEventListener('mouseup', () => {
        if (!isDown) {
            return;
        }
        elWidgetsContent.classList.remove('dragging');
        isDown = false;
        // Snap back to initial position if close enough
        const diffX = parseInt(elWidgetsContent.style.left) - initialLeft;
        const diffY = parseInt(elWidgetsContent.style.top) - initialTop;
        if (Math.abs(diffX) < 100 && Math.abs(diffY) < 100) {
            resetPosition();
        }
    }, true);
    document.addEventListener('mousemove', e => {
        if (!isDown) {
            return;
        }
        elWidgetsContent.style.left = (e.clientX + offsetX) + 'px';
        elWidgetsContent.style.top  = (e.clientY + offsetY) + 'px';
    }, true);
    document.addEventListener('dblclick', resetPosition);

    function resetPosition() {
        elWidgetsContent.style.left = initialLeft + 'px';
        elWidgetsContent.style.top  = initialTop + 'px';
    }
}

// Source: https://gist.github.com/Machy8/1b0e3cd6c61f140a6b520269acdd645f
function on(eventType, selector, callback) {
    document.addEventListener(eventType, event => {
        if (event.target.matches === undefined) {
            // Avoid errors in Brave
            return;
        }
        // Parse target and its ancestors, until a matching selector is found
        let el = event.target;
        while (el) {
            if (el.matches(selector)) {
                callback(el);
                break;
            } else {
                el = el.parentElement; // null after parsing the "html" element
            }
        }
    }, true); // "true" required for correct behaviour of e.g. "mouseenter" / "mouseleave" attached to elements that have children
}
