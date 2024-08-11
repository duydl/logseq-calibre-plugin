☕ [Support my work](https://www.buymeacoffee.com/duydole00) if you find this helpful!

# Logseq Calibre Annotation

> Now incorporated with [`calibreMetadata`](https://github.com/duydl/logseq-calibre-metadata).

Enhance note-taking experience with Logseq by integrating with [Calibre](https://calibre-ebook.com/), a robust e-book management software, by leveraging Calibre's Content Server API.

- **Calibre Content Server** is a convenient tool for reading in browsers as well as syncing progress and annotations between devices. Now, book metadata and annotations from Calibre can seamlessly sync to Logseq graph.
  
## Usage

The `calibreAnnotation` plugin introduces a slash command, `Calibre Annotation: Add a Calibre book`, for importing books from Calibre into Logseq with formats similar to Zotero's.

Additionally, the plugin provides two button renderers:
- `calibreViewer`: Opens the book at current progress location or annotation location.
- `calibreSync`: Toggle real-time annotation syncing from Calibre to a designated block.

### 1. Adding Books

Use the slash command, `Calibre Annotation: Add a Calibre book`, to search your library and add book metadata along with template buttons at either the page or block level.

You can configure the import process with the following settings:

- **Calibre Library** (`calibreLibrary`): Specify your preferred Calibre library name.
- **Add as Block** (`addBlockInstead`): Choose whether to import the book as a block at the cursor position instead of creating a new page.
- **Page Title Template** (`pageTitleTemplate`): Define the template for new Calibre page titles, with the default being `calibre/{{title}} - {{authors}} ({{date}})`.
- **Page Properties** (`pageProperties`): Select metadata properties to include, such as `tags, isbn, date, publisher, language, authors, format`. Note that the 'rating' property may return an error.
- **Preferred Book Format** (`bookFormat`): Choose the preferred book format for the Viewer and Sync macros, with the default being `epub`.
- **Content Server Link** (`serverLink`): Specify the link to your Calibre Content Server, with the default being `http://localhost:8080`.

### 2. Viewer

The button renderer, `{{renderer calibreViewer, color, link}}`, ![](screenshots\viewer.svg), will open a book viewer in the right sidebar of Logseq. It is automatically added when a book is imported. It could open book from another library then the one set in import metadata. 

You can adjust its appearance and behavior with the following setting:

- **Adjust Viewer Width** (`viewerWidth`): Set the viewer width as a percentage. Reopen the viewer for changes to take effect. Your reading position will be remembered.

### 3. Syncing and Viewing Annotations

The button renderer, `{{renderer calibreSync, syncstate, interval, hostlink, lib, id, fmt}}`,<svg xmlns:xlink="http://www.w3.org/1999/xlink" xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 24 24" width="1.8em" height="1.8em" fill="var(--r-link-color-dark)"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <title>icon/24/sync</title> <desc>Created with Sketch.</desc> <defs> </defs> <g fill-rule="evenodd" stroke-width="1" stroke="none" id="Output-svg"> <g transform="translate(-559.000000, -105.000000)" id="out"> <path transform="translate(571.000000, 117.000000) scale(-1, 1) translate(-571.000000, -117.000000)" id="sync" d="M572.163179,108.773986 C571.821387,108.744485 571.549732,108.4688 571.549732,108.114784 L571.549732,106.853349 C571.549732,106.562405 571.226709,106.396587 571.000494,106.571561 L567.254616,109.483035 C566.915787,109.746512 566.9148,110.270414 567.253628,110.533892 L571.000494,113.454521 C571.225721,113.630512 571.549732,113.464694 571.549732,113.17375 L571.549732,112.009974 C571.549732,111.604077 571.903377,111.288718 572.293573,111.348738 C575.032846,111.777016 577.041119,114.496222 576.41483,117.550116 C576.289375,118.162523 576.04933,118.736273 575.72038,119.247968 C575.360808,119.808492 575.504044,120.561284 576.036488,120.949888 L576.057233,120.96413 C576.601531,121.361889 577.377971,121.249987 577.749398,120.678272 C578.537692,119.461598 579,118.001792 579,116.429067 C579,112.402647 575.992036,109.100535 572.163179,108.773986 Z M569.836821,125.226014 C570.178613,125.255515 570.450268,125.5312 570.450268,125.885216 L570.450268,127.146651 C570.450268,127.437595 570.773291,127.603413 570.999506,127.428439 L574.745384,124.516965 C575.084213,124.253488 575.0852,123.729586 574.746372,123.466108 L570.999506,120.545479 C570.774279,120.369488 570.450268,120.535306 570.450268,120.82625 L570.450268,121.990026 C570.450268,122.395923 570.096623,122.711282 569.706427,122.651262 C566.967154,122.222984 564.958881,119.503778 565.58517,116.449884 C565.710625,115.837477 565.95067,115.263727 566.27962,114.752032 C566.639192,114.191508 566.495956,113.438716 565.963512,113.050112 L565.942767,113.03587 C565.398469,112.638111 564.622029,112.750013 564.250602,113.321728 C563.462308,114.538402 563,115.998208 563,117.570933 C563,121.597353 566.007964,124.899465 569.836821,125.226014 Z"> </path> </g> </g> </g></svg> <svg xmlns="http://www.w3.org/2000/svg" fill="crimson" viewBox="0 0 24 24" width="1.8em" height="1.8em"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path d="M12 21C10.22 21 8.47991 20.4722 6.99987 19.4832C5.51983 18.4943 4.36628 17.0887 3.68509 15.4442C3.0039 13.7996 2.82567 11.99 3.17294 10.2442C3.5202 8.49836 4.37737 6.89472 5.63604 5.63604C6.89472 4.37737 8.49836 3.5202 10.2442 3.17294C11.99 2.82567 13.7996 3.0039 15.4442 3.68509C17.0887 4.36628 18.4943 5.51983 19.4832 6.99987C20.4722 8.47991 21 10.22 21 12C21 14.387 20.0518 16.6761 18.364 18.364C16.6761 20.0518 14.387 21 12 21ZM12 4.5C10.5166 4.5 9.0666 4.93987 7.83323 5.76398C6.59986 6.58809 5.63856 7.75943 5.07091 9.12988C4.50325 10.5003 4.35473 12.0083 4.64411 13.4632C4.9335 14.918 5.64781 16.2544 6.6967 17.3033C7.7456 18.3522 9.08197 19.0665 10.5368 19.3559C11.9917 19.6453 13.4997 19.4968 14.8701 18.9291C16.2406 18.3614 17.4119 17.4001 18.236 16.1668C19.0601 14.9334 19.5 13.4834 19.5 12C19.5 10.0109 18.7098 8.10323 17.3033 6.6967C15.8968 5.29018 13.9891 4.5 12 4.5Z"></path> <path d="M14.5 8H9.5C8.67157 8 8 8.67157 8 9.5V14.5C8 15.3284 8.67157 16 9.5 16H14.5C15.3284 16 16 15.3284 16 14.5V9.5C16 8.67157 15.3284 8 14.5 8Z"></path> </g></svg>, toggles the sync process. It imports annotations from Calibre into the corresponding blocks in real-time. Clicking again will stop syncing. The block's `lastsync` property tracks the latest sync position.

This renderer is also automatically added when a book is imported. The parameters `lib` and `fmt`
are controlled by Metadata setting and could be adjusted. 

### 4. Authentication for User Login

If your Calibre Content Server requires a login, you can configure authentication settings:

- **Username** (`username`): Set the username for login.
- **Password** (`password`): Set the password for login. ⚠ Ensure your password is securely stored.
- **Open in Browser** (`openInBrowser`): Enable this option to open books and annotations in your browser instead of within Logseq. This also applies if login is not required.

Note that currently, the Logseq sidebar viewer does not support login-required content.

### 5. Additional Tips

- **Copy Annotations:** For details on copying annotations from Calibre to Logseq, refer to [this issue discussion](https://github.com/duydl/logseq-calibre-annotation/issues/8#issuecomment-2046574914).
  
- **Annotate Webpages:** Save webpages as ePubs and import them into Calibre using tools like [Save as eBook](https://github.com/alexadam/save-as-ebook) and [Shiori](https://github.com/go-shiori/shiori).

## Demo

<!-- Add GIFs to showcase plugin features -->

## Contribution

To contribute, clone the repository locally, and then build with:

```sh
npm install
npm run build
```

After building, open the Logseq Plugins panel, click on `Load unpacked plugin`, and navigate to your repository location.