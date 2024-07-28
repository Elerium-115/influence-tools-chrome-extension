# Influence Tools - Chrome Extension

## About

**Discover and use community developed tools while playing Influence**

This Chrome extension makes community-developed tools and widgets available inside the Influence game client.

It adds a "Widgets" button in the top-right, giving you an in-game "Shopping List" and "Marketplace Prices" (more widgets to follow).

It also adds a "Tools" panel in the right-side menu, with links to community developed tools and content, grouped into several categories: Mining, Production, Asteroids, Crew, Flight, Information, Lore, Games.

And it also adds other functionalities in-game, such as:
- buttons for "Search in Marketplace" and "Production Chain", when you select an item from an inventory
- the market value of the selected inventory items
- links to market-search for products in the Marketplace window "My Open Limit Orders"
- a button linking to the Process Finder tool, for the items in the currently selected warehouse
- a filter to search among the processes of Refineries, Factories and Shipyards
- an input for setting your preferred extraction percentage, to be used before you start each extraction
- an AI-generated captain-video in the crew window
- the real-world time, based on the in-game time that's being previewed while using the time-controls
- details about the controller(s) for the selected location: lot, building, ship, asteroid

<img src="./README.png" width="100%">

As of April 2024, this Chrome Extension works with the following versions of the Influence game client:
- "Limited Release" on Starknet mainnet - https://game.influenceth.io/
- "Pre-Release" on Starknet Sepolia - https://game-prerelease.influenceth.io/

## How to use

**Method 1 - recommended for most users:**

Simply install the extension from the Chrome Web Store, and enjoy automatic updates:
- https://chromewebstore.google.com/detail/influence-tools/kopdkjlnbfiegpdjiebogkakjfppfglj

**Method 2 - for users worried about automated updates:**

If you are worried about the safety of automatic updates you can install the extension manually. For full manual steps, check method 3. Otherwise you can use the scipt provided to automate the download part:
- Download *manual_installation.ps1* from the files list above and save it on your computer.
- Execute the script (right click > run with PowerShell) and follow the instuctions (you can also refer to https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked after the download completes).
- When you want to update, simply the script again and reload the extension.

**Method 3 - for developers and power users:**

Similar to menthod two but without scripted download. This method allows you to change the extension's source code, but you will need to manually load it in your browser, every time you make changes, or when this respository is updated:
- Download this repository and unpack it (if downloaded as ZIP) into a dedicated folder on your computer. This will be your unpacked extension.
- Follow these instructions for loading an unpacked extension in your Chromium-based browser (Chrome, Brave etc.)
    - https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked

## Dev notes

If you are a developer or content creator looking to integrate your website into Influence via this Chrome extension, feel free to [contact me](https://twitter.com/elerium115), and please consider the following:

- Consider using the styling from my [Influence CSS](https://github.com/Elerium-115/influence-css) library, as a starting point for your website.
- Make sure that your website or hosted content can be displayed in an iframe. For example "medium.com" is blocking its content from being displayed in an iframe, so it is not currently supported by this Chrome extension.

**Features:**

When a community tool is shown in-game within an iframe, some game-state details may be added into the URL of that iframe, as query parameters:
- `influence_asteroid` = the ID of the currently selected asteroid
- `influence_crew` = the ID of the currently selected crew
- `walletAddress` = the address of the currently connected wallet

These may be referenced and used within the tools displayed in that iframe. For example, a developer could customize what they show when their tool is loaded, if relevant to that asteroid / crew / wallet address.
- Example:
    ```
    /**
    * Get asteroid ID injected from iframe parent, if any
    * e.g. game URL: https://game.influenceth.io/asteroids/104
    * => iframe URL: https://adalia.stuff/tool.html?influence_asteroid=104
    */
    const urlParams = new URLSearchParams(location.search);
    const influenceAsteroidId = urlParams.get('influence_asteroid');
    if (influenceAsteroidId) {
        // Pre-select stuff for this asteroid ID ...
    }
    ```

---

Created by [@elerium115](https://twitter.com/elerium115) for the space strategy sandbox MMO [Influence](https://www.influenceth.io/).
- This extension is not developed or audited by Unstoppable Games - the studio behind Influence.
