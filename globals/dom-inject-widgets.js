/**
 * Get the widgets button from the VISIBLE top-menu, if any
 */
function getVisibleWidgetsButton() {
    const elTopMenuVisible = getVisibleTopMenu();
    if (!elTopMenuVisible) {
        return null;
    }
    return elTopMenuVisible.querySelector('.e115-widgets-wrapper');
}

/**
 * Re-inject the widgets button periodically into the VISIBLE top-menu, if needed
 */
function reInjectWidgetsPeriodically() {
    // Inject a widgets button only when there is NO other VISIBLE widgets button
    setInterval(() => {
        const elVisibleWidgetsButton = getVisibleWidgetsButton();
        if (!elVisibleWidgetsButton) {
            injectWidgets();
        }
    }, 1000);
}

async function injectWidgets() {
    // Ensure there is a VISIBLE top-menu
    const elTopMenuVisible = getVisibleTopMenu();
    if (!elTopMenuVisible) {
        return;
    }
    // Prepare widgets wrapper
    const elWidgetsWrapper = createEl('div', null, ['e115-widgets-wrapper', 'e115-cursor-full']);
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
            const elListItem = createEl('li');
            elListItem.textContent = widget.title;
            elListItem.dataset.title = widget.title;
            elListItem.setAttribute('onclick', `selectWidget('${widget.title}')`);
            if (widget.default) {
                // Preselect default widget
                elListItem.classList.add('active');
                iframeUrl = widget.url;
            }
            elWidgetsList.append(elListItem);
        });
    }
    // Inject widgets wrapper into the VISIBLE top-menu, as the first child
    elTopMenuVisible.prepend(elWidgetsWrapper);
    // Post-injection actions
    // -- make the widgets draggable
    initDragWidgetsContent();
    // -- preload default widget in iframe
    loadWidgetIframe(iframeUrl);
}

function loadWidgetIframe(url) {
    if (!url) {
        return;
    }
    const elWidgetsWrapper = getVisibleWidgetsButton();
    if (!elWidgetsWrapper) {
        return;
    }
    const elWidgetIframe = elWidgetsWrapper.querySelector('iframe');
    elWidgetIframe.src = url;
}

function toggleWidgets() {
    const elWidgetsWrapper = getVisibleWidgetsButton();
    if (!elWidgetsWrapper) {
        return;
    }
    elWidgetsWrapper.classList.toggle('active');
    // Pin widgets above other game-windows (e.g. marketplace) if active
    elWidgetsWrapper.parentElement.classList.toggle('e115-widgets-pinned', elWidgetsWrapper.classList.contains('active'));
}

function selectWidget(title) {
    const elWidgetsWrapper = getVisibleWidgetsButton();
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
