function getElLastBottomMenuItem() {
    const elsBottomMenuItem = document.querySelectorAll(`.${cls.bottomMenuItem[1]}`);
    const elLastBottomMenuItem = [...elsBottomMenuItem].pop();
    return elLastBottomMenuItem;
}

/** Add classes from array of class-names */
function addCls(el, classes) {
    classes.forEach(className => el.classList.add(className));
}

/** Delete DOM element matching selector */
function delSel(selector) {
    // console.log(`--- [delSel] selector = ${selector}`); //// TEST
    el = document.querySelector(selector);
    el.parentElement.removeChild(el);
}

function createEl(nodeType, primaryClasses = null, secondaryClasses = null) {
    const el = document.createElement(nodeType);
    if (primaryClasses) {
        addCls(el, primaryClasses);
    }
    if (secondaryClasses) {
        addCls(el, secondaryClasses);
    }
    return el;
}

function flashSidePanel(el) {
    // -- first flash
    el.classList.add('e115-hover');
    setTimeout(() => {
        el.classList.remove('e115-hover');
        setTimeout(() => {
            // -- second flash
            el.classList.add('e115-hover');
            setTimeout(() => {
                el.classList.remove('e115-hover');
            }, 250);
        }, 250);
    }, 500);
}

function injectStandardWindow(title, url) {
    // console.log(`--- [injectStandardWindow] title = ${title}`); //// TEST
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
    const elNewWindowWrapper = createEl('div', cls.standardWindowWrapper, ['e115-window-wrapper', 'e115-cursor']);
    elNewWindowWrapper.dataset.e115WindowId = title;
    // Prepare new standard window
    const elNewWindow = createEl('div', cls.standardWindow, ['e115-window']);
    elNewWindowWrapper.appendChild(elNewWindow);
    // Prepare new standard window > header
    const elNewWindowHeader = createEl('div', null, ['e115-window-header']);
    elNewWindow.appendChild(elNewWindowHeader);
    // Prepare new standard window > header > title
    const elNewWindowHeaderTitle = createEl('h1', cls.standardWindowTitle, ['e115-window-title']);
    elNewWindowHeaderTitle.textContent = title;
    elNewWindowHeader.appendChild(elNewWindowHeaderTitle);
    // Prepare new standard window > header > button
    const elNewWindowHeaderButton = createEl('a', cls.button, ['e115-button', 'e115-cursor-full']);
    elNewWindowHeaderButton.href = url.replace(/([?&])embed=?[^?&]*/, '$1').replace('&&', '&').replace(/[?&]$/, ''); // remove "embed" query-param, if any
    elNewWindowHeaderButton.target = '_blank';
    elNewWindowHeaderButton.innerHTML = `Open in new window${svg.e115ButtonCorner}`;
    elNewWindowHeader.appendChild(elNewWindowHeaderButton);
    // Prepare new standard window > close
    const elNewWindowClose = createEl('button', cls.standardWindowClose, ['e115-window-close', 'e115-cursor-full']);
    elNewWindowClose.innerHTML = svg.e115IconClose;
    // Define onclick handler to delete this window
    elNewWindowClose.dataset.onClickFunction = 'delSel';
    elNewWindowClose.dataset.onClickArgs = JSON.stringify([`[data-e115-window-id='${title}']`]);
    elNewWindow.appendChild(elNewWindowClose);
    // Prepare new standard window > iframe
    const elNewWindowIframe = document.createElement('iframe');
    elNewWindowIframe.src = url;
    elNewWindow.appendChild(elNewWindowIframe);
    // Inject new standard window, right before the bottom menu wrapper (i.e. after any "official" window)
    const elBottomMenuWrapper = document.querySelector(`.${cls.bottomMenuWrapper[1]}`);
    elBottomMenuWrapper.insertAdjacentHTML('beforebegin', elNewWindowWrapper.outerHTML);
    const elNewWindowWrapperInjected = document.querySelector(`[data-e115-window-id='${title}']`);
    return elNewWindowWrapperInjected;
}

function injectSideMenuPanel(title, items_stringify) {
    // console.log(`--- [injectSideMenuPanel] title = ${title}`); //// TEST
    // Check if side menu panel already exists with the same "title"
    const elMatchingSideMenuPanel = document.querySelector(`[data-e115-panel-id="${title}"]`);
    if (elMatchingSideMenuPanel) {
        flashSidePanel(elMatchingSideMenuPanel);
        return;
    }
    // Prepare new side menu panel
    const elNewSideMenuPanel = createEl('div', cls.sideMenuPanel, ['e115-cursor']);
    elNewSideMenuPanel.dataset.e115PanelId = title;
    // Prepare new side menu panel > bar
    const elNewSideMenuPanelBar = createEl('div', cls.sideMenuPanelBar, ['e115-side-menu-panel-bar']);
    elNewSideMenuPanelBar.innerHTML = svg.e115IconShip;
    elNewSideMenuPanel.appendChild(elNewSideMenuPanelBar);
    // Prepare new side menu panel > title
    const elNewSideMenuPanelTitle = createEl('h2', cls.sideMenuPanelTitle, ['e115-cursor-full']);
    elNewSideMenuPanelTitle.textContent = title;
    elNewSideMenuPanel.appendChild(elNewSideMenuPanelTitle);
    // Prepare new side menu panel > close
    const elNewSideMenuPanelClose = createEl('button', cls.sideMenuPanelClose, ['e115-side-menu-panel-close', 'e115-cursor-full']);
    elNewSideMenuPanelClose.innerHTML = svg.e115IconClose;
    // Define onclick handler to delete this panel
    elNewSideMenuPanelClose.dataset.onClickFunction = 'delSel';
    elNewSideMenuPanelClose.dataset.onClickArgs = JSON.stringify([`[data-e115-panel-id='${title}']`]);
    elNewSideMenuPanel.appendChild(elNewSideMenuPanelClose);
    // Prepare new side menu panel > content
    const elNewSideMenuPanelContent = createEl('div', cls.sideMenuPanelContent, ['e115-side-menu-panel-content']);
    try {
        const items = JSON.parse(items_stringify);
        let contentHtml = `<ul class="e115-list">`;
        items.forEach(itemData => {
            contentHtml += /*html*/ `
                <li>
                    <a class="e115-cursor-full"
                        data-on-click-function="injectStandardWindow"
                        data-on-click-args='${JSON.stringify([itemData.title, itemData.url])}'
                    >${itemData.title} <span class="e115-faded">- by ${itemData.author}</span></a>
                </li>
            `;
        });
        contentHtml += `</ul>`;
        elNewSideMenuPanelContent.innerHTML = contentHtml;
    } catch (error) {
        console.log(`--- [injectSideMenuPanel] ERROR:`, {error}); //// TEST
    }
    elNewSideMenuPanel.appendChild(elNewSideMenuPanelContent);
    // Inject new side menu panel, right after the last side menu panel
    const elsSideMenuPanel = document.querySelectorAll(`.${cls.sideMenuPanel[1]}`);
    const elLastSideMenuPanel = [...elsSideMenuPanel].pop();
    elLastSideMenuPanel.insertAdjacentHTML('afterend', elNewSideMenuPanel.outerHTML);
    const elNewSideMenuPanelInjected = document.querySelector(`[data-e115-panel-id='${title}']`);
    flashSidePanel(elNewSideMenuPanelInjected);
    return elNewSideMenuPanelInjected;
}

/**
 * 
 * @param label e.g. "Tools"
 * @param list e.g. [{category: 'Mining', items: [{title: 'Tool Name', url: 'http...'}, ...]}, ...]
 */
function injectBottomMenuItem(label, list) {
    // console.log(`--- [injectBottomMenuItem] label = ${label}`); //// TEST
    // Check if it will be possible to inject the new menu item
    const elLastBottomMenuItem = getElLastBottomMenuItem();
    if (!elLastBottomMenuItem) {
        console.log(`--- [injectBottomMenuItem] ERROR: bottom menu not yet loaded`); //// TEST
        return null;
    }
    // Prepare new menu item
    const elNewMenuItem = createEl('div', cls.bottomMenuItem, ['e115-cursor-full']);
    elNewMenuItem.dataset.e115MenuId = label;
    // Prepare new menu item > label
    const elNewMenuItemLabel = createEl('div', cls.bottomMenuItemLabel);
    elNewMenuItemLabel.textContent = label;
    elNewMenuItem.appendChild(elNewMenuItemLabel);
    // Prepare new menu item > list
    const elNewMenuItemList = createEl('div', cls.bottomMenuItemList);
    list.forEach(listItemData => {
        const elNewMenuItemListItem = createEl('div', cls.bottomMenuItemListItem, ['e115-bottom-menu-item-list-item']);
        elNewMenuItemListItem.innerHTML = /*html*/ `${svg.e115IconShip}<span>${listItemData.category_short}</span>`;
        elNewMenuItemListItem.dataset.e115SubmenuId = listItemData.category_short;
        // Define onclick handler to open side panel
        elNewMenuItemListItem.dataset.onClickFunction = 'injectSideMenuPanel';
        elNewMenuItemListItem.dataset.onClickArgs = JSON.stringify([listItemData.category, JSON.stringify(listItemData.items)]);
        elNewMenuItemList.appendChild(elNewMenuItemListItem);
    });
    elNewMenuItem.appendChild(elNewMenuItemList);
    // Inject new menu item, right after the last menu item
    elLastBottomMenuItem.insertAdjacentHTML('afterend', elNewMenuItem.outerHTML);
    const elNewMenuItemInjected = document.querySelector(`[data-e115-menu-id='${label}']`);
    return elNewMenuItemInjected;
}

// Source: https://gist.github.com/Machy8/1b0e3cd6c61f140a6b520269acdd645f
function on(eventType, selector, callback) {
    document.addEventListener(eventType, event => {
        // console.log(`--- EVENT ${eventType} @ el:`, event.target); //// TEST
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
