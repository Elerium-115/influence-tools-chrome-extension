# Influence Tools - Chrome Extension

## About

This Chrome extension will inject a "Tools" menu item into the Influence game client, with links to community-developed tools and content, grouped into several categories: Mining, Production, Asteroids, Crew, Information, Lore.

<img src="./README.png" width="100%">

**Note:** As of December 2022, this Chrome Extension only works with the testnet client of Influence:
https://game-goerli.influenceth.io/

## How to use

1. Download this repository and unpack it (if downloaded as ZIP) into a dedicated folder on your computer. This will be your unpacked extension.
2. Follow these instructions for loading an unpacked extension in your Chromium-based browser (Chrome, Brave etc.)
    - https://developer.chrome.com/docs/extensions/mv3/getstarted/development-basics/#load-unpacked

## Dev notes

If you are a developer or content creator looking to integrate your website into Influence via this Chrome extension, feel free to [contact me](https://twitter.com/elerium115), and please consider the following:

- Avoid setting any background color or background image for your website. This ensures that it will be embedded in the game client with a transparent background (see above snapshot).
- Consider using the styling from my [Influence CSS](https://github.com/Elerium-115/influence-css) library, as a starting point for your website.
- Make sure that your website or hosted content can be displayed in an iframe. For example "medium.com" is blocking its content from being displayed in an iframe, so it is not currently supported by this Chrome extension.

---

Created by [@elerium115](https://twitter.com/elerium115) for the space strategy sandbox MMO [Influence](https://www.influenceth.io/).
