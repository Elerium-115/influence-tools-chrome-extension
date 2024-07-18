const svgIconCommunityTools = `<svg class="e115-icon-community-tools" version="1.1" viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><path d="m700.36 208.62c37.5 9.5859 72.898 24.438 105.38 43.699l131.9-95.5 105.54 105.54-95.5 131.9c19.262 32.477 34.102 67.875 43.688 105.38l160.75 25.738v149.25l-160.74 25.738c-9.5859 37.5-24.438 72.898-43.699 105.38l95.5 131.9-105.54 105.54-131.9-95.5c-32.477 19.262-67.875 34.102-105.38 43.688l-25.738 160.75h-149.25l-25.738-160.74c-37.5-9.5859-72.898-24.438-105.38-43.699l-131.9 95.5-105.54-105.54 95.5-131.9c-19.262-32.477-34.102-67.875-43.688-105.38l-160.75-25.738v-149.25l160.75-25.738c9.5859-37.5 24.426-72.898 43.688-105.38l-95.5-131.9 105.54-105.54 131.9 95.5c32.477-19.262 67.875-34.102 105.38-43.688l25.738-160.75h149.25zm-100.36 120.89c-149.39 0-270.49 121.1-270.49 270.49 0 67.926 25.051 130 66.398 177.51 27.125-86.938 108.24-150.07 204.1-150.07 95.875 0 176.99 63.125 204.1 150.07 41.352-47.5 66.398-109.59 66.398-177.51-0.023438-149.39-121.12-270.49-270.51-270.49zm0-35.625c-169.06 0-306.11 137.05-306.11 306.11s137.05 306.11 306.11 306.11 306.11-137.05 306.11-306.11-137.05-306.11-306.11-306.11zm0 103.31c-59.688 0-108.09 48.387-108.09 108.07s48.387 108.07 108.09 108.07c59.688 0 108.07-48.387 108.07-108.07s-48.375-108.07-108.07-108.07z" fill-rule="evenodd"/></svg>`;

// Source: icon in "Zoom to lot" button @ "Lot Info" hud-menu panel
const svgIconSearch = `<svg stroke="currentColor" fill="none" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;

// Source: https://www.iconfinder.com/icons/4763233/hierarchy_network_organization_sitemap_structure_icon
const svgIconProductionChains = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g><path d="M20,16.18V11H13V7.82a3,3,0,1,0-2,0V11H4v5.18a3,3,0,1,0,2,0V13h5v3.18a3,3,0,1,0,2,0V13h5v3.18a3,3,0,1,0,2,0Z"></path></g></svg>`;

const eleriumApiUrl = 'https://elerium-influence-api.vercel.app';

const crewmateVideosEndpoint = `${eleriumApiUrl}/data/crewmate-videos`;
const toolsEndpoint = `${eleriumApiUrl}/data/tools`;
const widgetsEndpoint = `${eleriumApiUrl}/data/widgets`;

const selectorHudMenu = '#hudMenu';
const selectorHudMenuPanel = '#hudMenuPanel';
const selectorTimeMenu = '#timeMenu';
const selectorTopMenu = '#topMenu';

/**
 * The default hud-menu item is "My Crews", because it always exists for a logged-in user:
 * - regardless of view (system view / asteroid view / surface view / ship view)
 * - regardless of page-load-screen being visible / dismissed (i.e. before / after clicking "Play")
 * - regardless of user actually having any crews
 */
const hudMenuItemLabelDefault = 'My Crews';

const hudMenuItemLabelMarketplace = 'Asteroid Markets';

const hudMenuItemLabelTools = 'Community Tools'; // to be injected

/**
 * This will be populated via API call to "crewmateVideosEndpoint"
 */
let crewmateVideos = null;

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

/**
 * MAX extraction amount (i.e. 100% of deposit amount).
 * This will be updated during "injectAndApplyExtractionPercent".
 */
let extractionAmountMax = 0;

/**
 * This will be set to TRUE the FIRST time that the panel containing "Show Used Deposits"
 * becomes open during the periodical execution of "autoHideUsedDeposits". It will then be
 * reset to FALSE when that panel is closed, or no longer contains "Show Used Deposits".
 */
let isOpenPanelWithUsedDeposits = false;

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

function getReactFiberForEl(el) {
    const reactFiberKey = Object.keys(el).find(key => key.includes('__reactFiber'));
    if (!reactFiberKey) {
        console.log(`%c--- [getReactFiberForEl] ERROR: reactFiberKey not found for el:`, 'background: red', el);
        return null;
    }
    return el[reactFiberKey];
}

/**
 * Get the VISIBLE hud-menu.
 * 
 * NOTE: On page-load, there may be 2 hud-menus with the same ID,
 * until the player clicks "Play" (if logged-in) or "Explore World" (if not logged-in).
 */
function getElHudMenu() {
    // Select the VISIBLE hud-menu, if any
    const elHudMenu = [...document.querySelectorAll(selectorHudMenu)].find(el => el.offsetParent);
    if (!elHudMenu) {
        // console.log(`%c--- [getElHudMenu] ERROR: elHudMenu not found`, 'background: red');
    }
    return elHudMenu;
}

function getElHudMenuPanel() {
    const elHudMenuPanel = document.querySelector(selectorHudMenuPanel);
    if (!elHudMenuPanel) {
        // console.log(`%c--- [getElHudMenuPanel] ERROR: elHudMenuPanel not found`, 'background: red');
    }
    return elHudMenuPanel;
}

function getElHudMenuItemByLabel(label) {
    const elHudMenu = getElHudMenu();
    if (!elHudMenu) {
        return null;
    }
    return elHudMenu.querySelector(`[data-tooltip-id='hudMenuTooltip'][data-tooltip-content='${label}']`);
}

function getElHudMenuItemSelected() {
    const elHudMenu = getElHudMenu();
    if (!elHudMenu) {
        return null;
    }
    // Parse sub-menus (each sub-menu then contains the actual menu-items)
    for (const elHudMenuSubmenu of elHudMenu.children) {
        // Parse each menu-item in this sub-menu
        for (const elHudMenuItem of elHudMenuSubmenu.children) {
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
    }
    return null;
}

function getCurrentAsteroidId() {
    let asteroidId = null;
    try {
        asteroidId = JSON.parse(localStorage.influence).state.asteroids.origin;
    } catch (error) {
        // Swallow this error, and continue with fallback
    }
    if (!asteroidId) {
        // Fallback from URL (only when the asteroid-details panel is open)
        const asteroidMatches = location.pathname.match(/\/asteroids\/(\d+)/);
        if (asteroidMatches) {
            asteroidId = Number(asteroidMatches[1]);
        }
    }
    return asteroidId;
}

function getCurrentCrewId() {
    let crewId = null;
    try {
        crewId = JSON.parse(localStorage.influence).state.selectedCrewId;
    } catch (error) {
        // Swallow this error, and continue with fallback
    }
    if (!crewId) {
        // Fallback from URL (only when the crew-details panel is open)
        const crewMatches = location.pathname.match(/\/crew\/(\d+)/);
        if (crewMatches) {
            crewId = Number(crewMatches[1]);
        }
    }
    return crewId;
}

function getCurrentWalletAddress() {
    let walletAddress = null;
    try {
        const sessions = JSON.parse(localStorage.influence).state.sessions;
        walletAddress = Object.keys(sessions)[0];
    } catch (error) {
        // Swallow this error, and continue with fallback
    }
    return walletAddress;
}

/**
 * e.g. "Thin-film Resistor" => "Thin-filmResistor"
 */
function getCompactName(name) {
    return name.replace(/\s+/g, '');
}

function getToolUrlProductionPlanner() {
    // Hardcoding the URL from "tools" for {author: "Elerium115", title: "Production Planner"}
    return 'https://influence.elerium.dev/production-planner.html';
}

function getCloseButtonFromHudMenuPanel() {
    let elCloseButton = null;
    const elHudMenuPanel = getElHudMenuPanel();
    if (elHudMenuPanel) {
        // Find the wrapper for the header-buttons
        const elFirstButton = elHudMenuPanel.querySelector('button');
        if (elFirstButton) {
            const elHeaderButtonsWrapper = elFirstButton.parentElement;
            // The "close" button should be the last of the header-buttons
            elCloseButton = [...elHeaderButtonsWrapper.querySelectorAll('button')].pop();
        }
    }
    if (!elCloseButton) {
        // Fallback to ugly "close" button
        elCloseButton = createEl('div');
        elCloseButton.textContent = '✕';
    }
    return elCloseButton;
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

function createEl(nodeType, id = null, classes = null) {
    const el = document.createElement(nodeType);
    if (id) {
        el.id = id;
    }
    if (classes) {
        classes.forEach(className => el.classList.add(className));
    }
    return el;
}

function addTooltip(el, tooltipContent, tooltipId='globalTooltip', tooltipPlace = 'top') {
    el.dataset.tooltipId = tooltipId;
    el.dataset.tooltipPlace = tooltipPlace;
    el.dataset.tooltipContent = tooltipContent;
}

function findElWithMatchingTextNode(elParent, descendantsSelector, text) {
    // Parse all descendants of "elParent" matching "descendantsSelector"
    const elsDescendants = elParent.querySelectorAll(descendantsSelector);
    for (const elDescendant of elsDescendants) {
        // Parse all nodes of "elDescendant"
        for (const elNode of [...elDescendant.childNodes]) {
            // Check if "elNode" is a text node with matching "text"
            if (elNode.nodeName === '#text' && elNode.textContent.trim().toLowerCase() === text.toLowerCase()) {
                return elDescendant;
            }
        }
    }
    return null;
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
    const elNewWindowWrapper = createEl('div', null, ['e115-window-wrapper']);
    elNewWindowWrapper.dataset.e115WindowId = title; // data-e115-window-id
    // Prepare new standard window
    const elNewWindow = createEl('div', null, ['e115-window']);
    elNewWindowWrapper.append(elNewWindow);
    // Prepare new standard window > header
    const elNewWindowHeader = createEl('div', null, ['e115-window-header']);
    elNewWindow.append(elNewWindowHeader);
    // Prepare new standard window > header > title
    const elNewWindowHeaderTitle = createEl('h1', null, ['e115-window-title']);
    elNewWindowHeaderTitle.textContent = title;
    elNewWindowHeader.append(elNewWindowHeaderTitle);
    // Prepare new standard window > header > buttons-wrapper
    const elNewWindowHeaderButtons = createEl('div', null, ['e115-window-buttons']);
    elNewWindowHeader.append(elNewWindowHeaderButtons);
    // Prepare new standard window > header > buttons-wrapper > "Safety Tips"
    const elNewWindowHeaderWarning = createEl('div', null, ['e115-button', 'e115-cursor-full']);
    elNewWindowHeaderWarning.textContent = 'Safety Tips';
    elNewWindowHeaderWarning.setAttribute('onmouseenter', 'toggleSafetyTips(true)');
    elNewWindowHeaderWarning.setAttribute('onmouseleave', 'toggleSafetyTips(false)');
    elNewWindowHeaderButtons.append(elNewWindowHeaderWarning);
    // Prepare new standard window > header > buttons-wrapper > "Open in new window"
    const elNewWindowHeaderButton = createEl('a', null, ['e115-button', 'e115-cursor-full']);
    elNewWindowHeaderButton.href = url;
    elNewWindowHeaderButton.target = '_blank';
    elNewWindowHeaderButton.textContent = 'Open in new window';
    elNewWindowHeaderButtons.append(elNewWindowHeaderButton);
    // Prepare new standard window > header > buttons-wrapper > close
    const elNewWindowClose = closeButtonClone.cloneNode(true);
    elNewWindowClose.classList.add('e115-window-close'); // class used for closing the injected window
    // Define onclick handler to delete this window
    elNewWindowClose.dataset.onClickFunction = 'onClickNewWindowClose';
    elNewWindowClose.dataset.onClickArgs = JSON.stringify([title]);
    elNewWindowHeaderButtons.append(elNewWindowClose);
    // Prepare new standard window > content > Safety Tips
    const elNewWindowSafety = createEl('div', null, ['e115-window-content', 'e115-window-safety', 'e115-hidden']);
    elNewWindowSafety.innerHTML = /*html*/ `
        <h2>Safety Tips</h2>
        <ul>
            <li>This tool is embedded from a third-party website, without any guarantees, and beyond the control of <span class="e115-color-influence">${location.hostname}</span>.</li>
            <li>This embedded tool may trigger requests to your L1 and/or L2 wallet, but it does NOT have access to your game account.</li>
            <li>Ensure that you fully understand the origin and impact of any wallet request, before you approve it!</li>
        </ul>
    `;
    elNewWindow.append(elNewWindowSafety);
    // Prepare new standard window > content > iframe
    const elNewWindowIframe = createEl('iframe', null, ['e115-window-content']);
    let iframeUrl = url;

    // Inject ID of selected asteroid (if any) into the iframe URL
    const asteroidId = getCurrentAsteroidId();
    if (asteroidId) {
        iframeUrl = injectUrlParam(iframeUrl, 'influence_asteroid', asteroidId);
    }

    // Inject ID of selected crew (if any) into the iframe URL
    const crewId = getCurrentCrewId();
    if (crewId) {
        iframeUrl = injectUrlParam(iframeUrl, 'influence_crew', crewId);
    }

    // Inject the player's wallet address (if any) into the iframe URL
    const walletAddress = getCurrentWalletAddress();
    if (walletAddress) {
        // URL param name compatible with adalia.info tools, as of July 2024
        iframeUrl = injectUrlParam(iframeUrl, 'walletAddress', walletAddress);
    }

    elNewWindowIframe.src = iframeUrl;
    elNewWindow.append(elNewWindowIframe);
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
    if (!elInjectedHudMenuItem) {
        //// TO DO: investigate how this may happen (observed once during local dev)
        return null;
    }
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
                console.log(`%c--- [toggleInjectedMenuItemByLabel] ABORT re: elHudMenuItemSelected did NOT become de-selected`, 'background: orange; color: black');
                return;
            }
        }
        elInjectedHudMenuItem.dataset.e115State = 'selected'; // data-e115-state
        elInjectedHudMenuItem.classList.value = hudMenuItemSelectedClassListValue;
        const elHudMenuPanel = getElHudMenuPanel();
        // The real hud-menu panel (closed, at this point) must be completely hidden
        elHudMenuPanel.style.display = 'none';
        // Inject the cloned hud-menu panel into the DOM
        elHudMenuPanel.parentElement.append(hudMenuPanelOpenClone);
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

function injectConfig() {
    const elConfigPanel = createEl('div', 'e115-config-panel-wrapper');
    elConfigPanel.innerHTML = /*html*/ `
        <div id="e115-config-panel">
            <div id="e115-config-options">
                <label>
                    <input type="checkbox" name="inventory-item-names" checked><span>Overlay names for inventory items</span>
                </label>
            </div>
            <div id="e115-config-title">Influence Tools extension</div>
        </div>
    `;
    document.body.append(elConfigPanel);

    //// TO DO: save this value into local-storage => pre-load it
    document.body.dataset.inventoryItemNames = 'true';
}

async function updateCrewmateVideosIfNotSet() {
    if (crewmateVideos) {
        return;
    }
    try {
        const crewmateVideosResponse = await fetch(crewmateVideosEndpoint);
        crewmateVideos = await crewmateVideosResponse.json();
    } catch (error) {
        // Swallow this error
    }
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

/**
 * Get the VISIBLE top-menu, depending on the state of the main-menu:
 * - main-menu open => 2 elements matching "selectorTopMenu" (only 1 visible)
 * - main-menu closed => 1 element matching "selectorTopMenu" (visible)
 */
function getVisibleTopMenu() {
    const elsTopMenu = document.querySelectorAll(selectorTopMenu);
    for (const elTopMenu of elsTopMenu) {
        if (elTopMenu.offsetParent) {
            // Visible top-menu
            return elTopMenu;
        }
    }
    // No visible top-menu
    return null;
}

function getElGameTimeWrapper() {
    const elTimeMenu = document.querySelector(selectorTimeMenu);
    if (!elTimeMenu) {
        // Not yet visible, or element removed from DOM on low-res
        return null;
    }
    let elGameTimeWrapper = elTimeMenu.lastElementChild;
    if (elGameTimeWrapper.id === 'e115-real-time') {
        // Real-time already injected => game-time is the previous element
        elGameTimeWrapper = elGameTimeWrapper.previousElementSibling;
    }
    return elGameTimeWrapper;
}

function getGameTimeDays() {
    const elGameTimeWrapper = getElGameTimeWrapper();
    if (!elGameTimeWrapper) {
        // Not yet visible, or element removed from DOM on low-res
        return 0;
    }
    return elGameTimeWrapper.lastElementChild.textContent.replace(/,/g, '');
}

function injectRealTime() {
    // Inject the real-time only after the time-menu is loaded and visible
    const existCondition = setInterval(async () => {
        // Wait for the time-menu to become visible
        const elTimeMenu = document.querySelector(selectorTimeMenu);
        if (!elTimeMenu || !elTimeMenu.offsetParent) {
            // Not yet visible
            return;
        }
        // Stop waiting
        clearInterval(existCondition);
        const elRealTime = createEl('div', 'e115-real-time');
        elTimeMenu.append(elRealTime);
        let gameTimeDaysCurrent = getGameTimeDays();
        // Periodically update the real-time, based on the game-time
        setInterval(() => {
            const elGameTimeWrapper = getElGameTimeWrapper();
            if (!elGameTimeWrapper) {
                return;
            }
            const elGameTimeControls = elGameTimeWrapper.firstElementChild;
            if (elGameTimeControls.hasAttribute('open')) {
                // Game-time controls open => show real-time
                elRealTime.classList.remove('e115-hidden');
                // Update the real-time, based on the user-previewed game-time
                const gameTimeDaysPreviewed = getGameTimeDays();
                const realTimeDaysDiff = (gameTimeDaysPreviewed - gameTimeDaysCurrent) / 24;
                const nowTs = new Date().getTime();
                const realTimeDiffTs = realTimeDaysDiff * 24 * 60 * 60 * 1000;
                const realTimePreviewedDate = new Date(nowTs + realTimeDiffTs);
                // Format real-time based on the user's locale and timezone
                elRealTime.textContent = Intl.DateTimeFormat(undefined, {
                    dateStyle: 'long',
                    timeStyle: 'long',
                }).format(realTimePreviewedDate);
            } else {
                // Game-time controls closed => hide real-time
                elRealTime.classList.add('e115-hidden');
                // Save the current game-time
                gameTimeDaysCurrent = getGameTimeDays();
            }
        }, 100);
    }, 1000);
}

async function searchMarketplace(searchText) {
    const elHudMenuMarketplace = getElHudMenuItemByLabel(hudMenuItemLabelMarketplace);
    if (!elHudMenuMarketplace) {
        return;
    }
    elHudMenuMarketplace.click();
    // Wait for the Marketplace window to load
    await delay(1000);
    const elInput = document.querySelector('input[placeholder="Search by Name"]');
    if (!elInput) {
        console.log(`%c--- [searchMarketplace] ERROR: elInput not found`, 'background: red');
        return;
    }
    // Source: https://stackoverflow.com/a/76212435
    Object.defineProperty(elInput, "value", {
        value: searchText,
        writable: true,
    });
    var inputEvent = new Event('input', {bubbles: true});
    elInput.dispatchEvent(inputEvent);
    // Wait for search results to load
    await delay(500);
    const elResultsList = elInput.parentElement.nextElementSibling.firstElementChild;
    const elsResults = [...elResultsList.children];
    if (elsResults.length === 1) {
        // Auto-click if single result matching the search
        elsResults[0].click();
    }
}

/**
 * Inject relevant buttons in the inventory-footer, if a single inventory item is selected.
 * 
 * NOTE re: injecting the "Search in Marketplace" button
 * - This only works for inventories where the "Marketplace" button exists in the hud-menu (Warehouse / contruction site).
 * - It does NOT work for ship-cargo and ship-propellant inventories.
 */
function onClickInventoryItem(elItem) {
    const elItemWrapper = elItem.parentElement;
    const elItemsList = elItemWrapper.parentElement;
    const elInventoryFooter = elItemsList.nextElementSibling;
    if (!elInventoryFooter) {
        return;
    }
    let countSelected = 0;
    let elItemSelected = null;
    [...elItemsList.children].forEach(elParsedItemWrapper => {
        const reactProps = getReactPropsForEl(elParsedItemWrapper);
        if (reactProps && reactProps.selected) {
            elItemSelected = elParsedItemWrapper;
            countSelected++;
        }
    });
    if (countSelected === 1) {
        // Single item selected => inject relevant buttons
        const elItemSelectedName = elItemSelected.querySelector('[data-tooltip-content]').dataset.tooltipContent;
        // -- Inject "Search in Marketplace" button
        // ---- This only works for inventories where the "Marketplace" button exists in the hud-menu (Warehouse / contruction site).
        // ---- It does NOT work for ship-cargo and ship-propellant inventories.
        const elHudMenuMarketplace = getElHudMenuItemByLabel(hudMenuItemLabelMarketplace);
        if (elHudMenuMarketplace) {
            const elMarketplaceButton = createEl('div', null, ['e115-button', 'e115-button-inventory-footer']);
            addTooltip(elMarketplaceButton, 'Search in Marketplace');
            elMarketplaceButton.innerHTML = svgIconSearch;
            elMarketplaceButton.dataset.onClickFunction = 'searchMarketplace';
            elMarketplaceButton.dataset.onClickArgs = JSON.stringify([elItemSelectedName]);
            elInventoryFooter.append(elMarketplaceButton);
        }
        // -- Inject "Production Planner" button
        const elProductionButton = createEl('div', null, ['e115-button', 'e115-button-inventory-footer']);
        addTooltip(elProductionButton, 'Production Planner');
        elProductionButton.innerHTML = svgIconProductionChains;
        // ---- On click, open the item's production chain using the "Production Planner" tool
        const itemNameCompact = getCompactName(elItemSelectedName);
        const productionPlannerUrl = getToolUrlProductionPlanner() + '#' + itemNameCompact;
        if (!closeButtonClone) {
            closeButtonClone = getCloseButtonFromHudMenuPanel().cloneNode(true);
        }
        elProductionButton.dataset.onClickFunction = 'onClickCategoryItem';
        elProductionButton.dataset.onClickArgs = JSON.stringify(['Production Planner', productionPlannerUrl]);
        elInventoryFooter.append(elProductionButton);
    } else {
        // No item / multiple items selected => remove any injected buttons
        elInventoryFooter.querySelectorAll('.e115-button-inventory-footer').forEach(elButton => {
            elButton.parentElement.removeChild(elButton);
        });
    }
}

function onMouseoverCaptainVideoPlay() {
    const elCaptainVideoWrapper = document.getElementById('e115-captain-video-wrapper');
    if (!elCaptainVideoWrapper) {
        return;
    }
    elCaptainVideoWrapper.classList.remove('e115-video-icon-only');
    // Load the video from the start
    elCaptainVideo = document.getElementById('e115-captain-video');
    if (!elCaptainVideo) {
        return;
    }
    elCaptainVideo.load();
}

function onCaptainVideoEnded() {
    const elCaptainVideoWrapper = document.getElementById('e115-captain-video-wrapper');
    if (!elCaptainVideoWrapper) {
        return;
    }
    elCaptainVideoWrapper.classList.add('e115-video-icon-only');
}

/**
 * Inject the captain-video if available for the currently opened crew, if any
 */
async function injectCaptainVideo() {
    if (!location.pathname.match(/^\/crew\/(\d+)/)) {
        // Crew window NOT open
        return;
    }
    if (document.getElementById('e115-captain-video')) {
        // Captain video already injected
        return;
    }
    const elOwnedCrewBg = document.querySelector('div[src*="OwnedCrew"]');
    if (!elOwnedCrewBg) {
        return;
    }
    const elCaptainImg = elOwnedCrewBg.parentElement.querySelector('img[src*="/crewmates/"]');
    if (!elCaptainImg) {
        return;
    }
    const elCaptainCrewmateIdMatches = elCaptainImg.src.match(/\/crewmates\/(\d+)/);
    if (!elCaptainCrewmateIdMatches) {
        return;
    }
    const elCaptainCrewmateId = elCaptainCrewmateIdMatches[1];
    // If crewmate-videos not yet fetched (async), they need to be fetched now (sync), before continuing
    if (!crewmateVideos) {
        await updateCrewmateVideosIfNotSet();
    }
    if (crewmateVideos && crewmateVideos[elCaptainCrewmateId]) {
        const elCaptainVideoWrapper = createEl('div', 'e115-captain-video-wrapper');
        const elCaptainVideo = createEl('video', 'e115-captain-video');
        elCaptainVideo.controls = true;
        elCaptainVideo.src = crewmateVideos[elCaptainCrewmateId];
        elCaptainVideo.addEventListener('ended', onCaptainVideoEnded);
        elCaptainVideoWrapper.append(elCaptainVideo);
        // Inject overlay with "play" icon over the captain-video (hidden if the video is visible)
        const elCaptainVideoPlayIcon = createEl('div', 'e115-video-play-icon');
        elCaptainVideoPlayIcon.addEventListener('mouseenter', onMouseoverCaptainVideoPlay);
        elCaptainVideoWrapper.append(elCaptainVideoPlayIcon);
        elCaptainImg.parentElement.prepend(elCaptainVideoWrapper);
    }
}

/**
 * Inject a filter into the "Select Process" window, if any
 */
function injectProcessFilter() {
    if (document.getElementById('e115-filter-select-process')) {
        // Filter already injected
        return;
    }
    const elSelectProcessWindow = [...document.body.children].find(el => el.textContent.toLowerCase().includes('select process'));
    if (!elSelectProcessWindow) {
        // Select Process window NOT open
        return;
    }
    elSelectProcessWindow.classList.add('e115-select-process-window');
    const elSelectProcessTitle = [...elSelectProcessWindow.getElementsByTagName('div')].find(el => el.firstChild && el.firstChild.nodeName === '#text' && el.firstChild.textContent.trim().toLowerCase() === 'select process');
    if (!elSelectProcessTitle) {
        // Maybe the game's DOM structure has changed?
        return;
    }
    const elSelectProcessHeader = elSelectProcessTitle.parentElement;
    const elFilterWrapper = createEl('div', 'e115-filter-select-process');
    const elFilterInput = createEl('input', null, ['e115-input']);
    elFilterInput.type = 'text';
    elFilterInput.placeholder = 'Filter by process, input or output';
    elFilterInput.addEventListener('keyup', event => {
        /**
         * Prevent event-bubbling when the user presses any key other than "Escape", while typing into the filter-input.
         * - This allows the native logic to close the "Select Process" window when the user presses "Escape".
         * - But it prevents the window from closing when the user presses "Space" - e.g. typing "iron oxide".
         */
        if (event.key !== 'Escape') {
            event.stopPropagation();
        }
    });
    elFilterInput.addEventListener('input', () => {
        filterProcessesList(elFilterInput.value);
    });
    elFilterWrapper.append(elFilterInput);
    // Inject the filter right after the title (before the close-button)
    elSelectProcessHeader.insertBefore(elFilterWrapper, elSelectProcessTitle.nextSibling);
    elFilterInput.focus();
}

function filterProcessesList(elFilterInputValue) {
    const elSelectProcessWindow = document.querySelector('.e115-select-process-window');
    if (!elSelectProcessWindow) {
        // This function should NOT be called without the "Select Process" window having been marked, during the filter-injection
        return;
    }
    const filterText = elFilterInputValue.toLowerCase().trim();
    [...elSelectProcessWindow.querySelectorAll("tbody tr")].forEach(elRow => {
        if (!filterText) {
            // Show all processes if no text in filter-input
            elRow.classList.remove('e115-hidden');
            return;
        }
        let isMatch = false;
        if (elRow.textContent.toLowerCase().includes(filterText)) {
            // Process name matches the filter
            isMatch = true;
        } else {
            [...elRow.querySelectorAll('[data-tooltip-content]')].some(elProduct => {
                if (elProduct.dataset.tooltipContent.toLowerCase().includes(filterText)) {
                    // An input or output name matches the filter
                    isMatch = true;
                    return true; // skip remaining inputs / outputs
                }
            });
        }
        elRow.classList.toggle('e115-hidden', !isMatch);
    });
}

/**
 * Inject links on products from "My Open Limit Orders", if that window is open
 */
function injectMyOrdersProductLinks() {
    if (!location.pathname.match(/^\/marketplace\/(\d+)\/all\/orders/)) {
        // My Open Limit Orders window NOT open
        return;
    }
    const elMarketplaceHeader = document.querySelector('div[src*="/static/media/Marketplace"]');
    if (!elMarketplaceHeader || !elMarketplaceHeader.offsetParent) {
        // Not yet visible (e.g. on full page reload with this URL, before clicking "Play")
        return;
    }
    const elsOrderRows = elMarketplaceHeader.parentElement.querySelectorAll('table tbody tr');
    [...elsOrderRows].some(elOrderRow => {
        if (elOrderRow.classList.contains('e115-marked')) {
            // Order already parsed
            return;
        }
        const elProductCell = elOrderRow.querySelector('td:nth-child(3)');
        if (!elProductCell) {
            // Maybe the game's DOM structure has changed?
            return true; // skip remaining orders
        }
        elProductCell.classList.add('e115-color-influence', 'e115-cursor-full');
        elProductCell.addEventListener('click', () => {
            searchMarketplace(elProductCell.textContent.trim());
        });
        elOrderRow.classList.add('e115-marked');
    });
}

/**
 * Inject extraction-percent input if the "Extract Resource" window is open and ready to start extraction
 */
async function injectAndApplyExtractionPercent() {
    if (document.getElementById('e115-extraction-percent-wrapper')) {
        // Extraction-percent input already injected
        return;
    }
    const elExtractionHeader = document.querySelector('div[src*="/static/media/Extraction"]');
    if (!elExtractionHeader) {
        // Extract Resource window NOT open
        return;
    }
    // Find the "MAX" button, if any
    const elMaxButton = [...elExtractionHeader.parentElement.querySelectorAll('button')].find(elButton => elButton.textContent.toLowerCase().includes('max'));
    if (!elMaxButton) {
        // NOT ready to start extraction
        return;
    }
    const elExtractionDuration = elMaxButton.previousElementSibling;
    if (elExtractionDuration.textContent.trim() === '0s' && elMaxButton.disabled) {
        /**
         * NO deposit selected, i.e. extraction duration "0s" AND "elMaxButton" disabled.
         * 
         * NOTE: If the deposit is selected AFTER this window is open,
         * the extraction duration will remain "0s", but "elMaxButton" will become enabled.
         */
        return;
    }
    // Inject the extraction-percent input, before "elExtractionDuration"
    const elPercentWrapper = createEl('div', 'e115-extraction-percent-wrapper');
    const elPercentInput = createEl('input', null, ['e115-input']);
    elPercentInput.type = 'text';
    elPercentInput.addEventListener('input', () => {
        applyExtractionPercent(elPercentWrapper, elPercentInput.value);
    });
    elPercentWrapper.append(elPercentInput);
    elMaxButton.parentElement.insertBefore(elPercentWrapper, elExtractionDuration);
    // Force-click the "MAX" button, in case the deposit was selected after this window was open
    elMaxButton.click();
    // Wait for the animated increase of the extraction amount
    await delay(500);
    /**
     * Save the MAX extraction amount (i.e. 100% of deposit amount).
     * The value must be retrieved from the input (triggered via "mouseenter"),
     * to avoid issues with parsing "textContent" in different locales => different number formats.
     */
    const elAmountTextWrapper = elMaxButton.parentElement.children[0];
    await triggerExtractionAmountInput(elAmountTextWrapper);
    const elAmountInput = elAmountTextWrapper.querySelector('input');
    if (!elAmountInput) {
        // Maybe the game's DOM structure has changed?
        return;
    }
    extractionAmountMax = elAmountInput.value;
    // Apply the preferred extraction-percent from local-storage, if any
    applyExtractionPercent(elPercentWrapper);
}

/**
 * Apply the extraction-percent, and save it into local-storage.
 * If no "percentValue" given, apply the preferred extraction-percent from local-storage, if any.
 */
async function applyExtractionPercent(elPercentWrapper, percentValue = null) {
    if (!percentValue) {
        // NO value passed into this function => use the value from local-storage, or default to 100
        percentValue = localStorage.e115ExtractionPercent ? Number(localStorage.e115ExtractionPercent) : 100;
    }
    // Ensure "percentValue" is integer, MAX 100
    percentValue = Math.min(parseInt(`0${percentValue}`), 100);
    /**
     * Set "percentValue" into the input, in case it was either:
     * - not passed into this function, but retrieved from local-storage
     * - passed into this function as non-integer, and then forced to integer
     */
    elPercentWrapper.querySelector('input').value = percentValue;
    // Save the value into local-storage
    localStorage.e115ExtractionPercent = percentValue;
    // Apply the extraction-percent, via hover over "elAmountWrapper"
    const elAmountTextWrapper = elPercentWrapper.previousElementSibling;
    await triggerExtractionAmountInput(elAmountTextWrapper);
    const elAmountInput = elAmountTextWrapper.querySelector('input');
    if (!elAmountInput) {
        // Maybe the game's DOM structure has changed?
        return;
    }
    // Round down, to avoid a new value larger than MAX for 100%
    let newAmount = Math.floor(extractionAmountMax * percentValue / 100);
    /**
     * Set the new amount via workaround for React
     * Source: https://stackoverflow.com/a/66663506
     */
    const valueSetter = Object.getOwnPropertyDescriptor(elAmountInput, 'value').set;
    const prototype = Object.getPrototypeOf(elAmountInput);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;
    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(elAmountInput, newAmount);
    } else {
        valueSetter.call(elAmountInput, newAmount);
    }
    elAmountInput.dispatchEvent(new Event('input', {bubbles: true}));
}

async function triggerExtractionAmountInput(elAmountTextWrapper) {
    if (elAmountTextWrapper.querySelector('input')) {
        // Input already triggered
        return;
    }
    if (!elAmountTextWrapper) {
        // Maybe the game's DOM structure has changed?
        return;
    }
    const reactPropsWrapper = getReactPropsForEl(elAmountTextWrapper);
    if (!reactPropsWrapper || typeof reactPropsWrapper.onMouseEnter !== 'function') {
        // Maybe something else has changed?
        return;
    }
    reactPropsWrapper.onMouseEnter(new Event('mouseenter'));
    // Wait for the amount input to appear
    await delay(100);
}

/**
 * Auto-click the "Show Used Deposits" toggle, if it exists in the hud menu panel,
 * and if the associated checkbox is enabled (i.e. if the "svg" contains a "path").
 */
function autoHideUsedDeposits() {
    const elHudManuPanel = getElHudMenuPanel();
    if (!elHudManuPanel) {
        isOpenPanelWithUsedDeposits = false;
        return;
    }
    const reactPropsHudManuPanel = getReactPropsForEl(elHudManuPanel);
    if (!reactPropsHudManuPanel || !reactPropsHudManuPanel.open) {
        // The hud menu panel is closed
        isOpenPanelWithUsedDeposits = false;
        return;
    }
    // The hud menu panel is open
    const elShowUsedDeposits = findElWithMatchingTextNode(elHudManuPanel, '*', 'Show Used Deposits');
    if (!elShowUsedDeposits) {
        // The panel does NOT contain "Show Used Deposits"
        isOpenPanelWithUsedDeposits = false;
        return;
    }
    // The panel contains "Show Used Deposits"
    if (isOpenPanelWithUsedDeposits) {
        /**
         * The panel containing "Show Used Deposits" was already open
         * in the previous cycle => NOT running this logic again.
         */
        return;
    }
    isOpenPanelWithUsedDeposits = true;
    if (elShowUsedDeposits.querySelector('path')) {
        // The "Show Used Deposits" toggle is enabled => auto-click to disable it
        elShowUsedDeposits.click();
    }
    try {
        /**
         * Try to expand the "My Deposits" panel, if collapsed.
         * Doing this here will NOT auto-expand it if there are NO unused deposits,
         * but this avoids introducing another flag, in addition to "isOpenPanelWithUsedDeposits".
         */
        const elMyDeposits = elShowUsedDeposits.parentElement.previousElementSibling;
        const reactFiberMyDeposits = getReactFiberForEl(elMyDeposits);
        const isCollapsedMyDeposits = reactFiberMyDeposits.return.memoizedProps.collapsed;
        if (isCollapsedMyDeposits) {
            elMyDeposits.click();
        }
    } catch (error) {
        // Swallow non-critical error
        return;
    }
}

/**
 * Inject various features into the DOM periodically, as needed
 */
function injectFeaturesPeriodically() {
    setInterval(() => {
        injectWidgets();
        injectCaptainVideo();
        injectProcessFilter();
        injectMyOrdersProductLinks();
        injectAndApplyExtractionPercent();
        autoHideUsedDeposits();
    }, 1000);
}

/**
 * Handle messages e.g. from widgets iframe
 */
function handleMessage(event) {
    if (!event.data.widgetEventKey || !event.data.widgetEventValue) {
        // Not a valid message from the widgets iframe
        return;
    }
    switch (event.data.widgetEventKey) {
        case 'SHOPPING_LIST_CLICKED_PRODUCT_NAME':
            searchMarketplace(event.data.widgetEventValue);
            break;
    }
}

function onClickConfigTitle() {
    // Show / hide the extension-config options
    document.getElementById('e115-config-panel-wrapper').classList.toggle('active');
}

function onClickConfigOptions(el) {
    switch (el.name) {
        case 'inventory-item-names':
            document.body.dataset.inventoryItemNames = el.checked.toString();
            break;
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
