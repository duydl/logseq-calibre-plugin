☕ [Get me a coffee](https://www.buymeacoffee.com/duydole00) if you like this work!

# Logseq Calibre Annotation

> Now has been incorporated with [`calibreMetadata`](https://github.com/duydl/logseq-calibre-metadata).

Enhance note-taking experience with Logseq by integrating with [Calibre](https://calibre-ebook.com/), a robust e-book management software, specifically utilizing Calibre's Content Server API.

- Calibre Content Server is a convenient tool for reading in browsers as well as syncing progress and annotations between devices. Similarly, the annotations from Calibre could now seamlessly sync to Logseq graph.

## Usage

The `calibreAnnotation` plugin adds two button renderers for `calibreViewer` and `calibreSync`.

- `{{renderer calibreViewer, color, link}}` <svg fill="var(--r-link-color-dark)" height=1.8em width=1.8em viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M23 4C23 3.11596 21.855 2.80151 21.0975 2.59348C21.0279 2.57437 20.9616 2.55615 20.8997 2.53848C19.9537 2.26818 18.6102 2 17 2C15.2762 2 13.8549 2.574 12.8789 3.13176C12.7296 3.21707 12.5726 3.33492 12.4307 3.44143C12.2433 3.58215 12.0823 3.70308 12 3.70308C11.9177 3.70308 11.7567 3.58215 11.5693 3.44143C11.4274 3.33492 11.2704 3.21707 11.1211 3.13176C10.1451 2.574 8.72378 2 7 2C5.38978 2 4.0463 2.26818 3.10028 2.53848C3.04079 2.55547 2.97705 2.57302 2.91016 2.59144C2.156 2.79911 1 3.11742 1 4V17C1 17.3466 1.17945 17.6684 1.47427 17.8507C1.94329 18.1405 2.56224 17.8868 3.11074 17.662C3.30209 17.5835 3.48487 17.5086 3.64972 17.4615C4.4537 17.2318 5.61022 17 7 17C8.2613 17 9.20554 17.4161 9.9134 17.8517C10.0952 17.9636 10.279 18.1063 10.4676 18.2527C10.9338 18.6148 11.4298 19 12 19C12.5718 19 13.0653 18.6162 13.5307 18.2543C13.7195 18.1074 13.9037 17.9642 14.0866 17.8517C14.7945 17.4161 15.7387 17 17 17C18.3898 17 19.5463 17.2318 20.3503 17.4615C20.5227 17.5108 20.7099 17.5898 20.9042 17.6719C21.4443 17.9 22.0393 18.1513 22.5257 17.8507C22.8205 17.6684 23 17.3466 23 17V4ZM3.33252 4.55749C3.13163 4.62161 3 4.81078 3 5.02166V14.8991C3 15.233 3.32089 15.4733 3.64547 15.3951C4.53577 15.1807 5.67777 15 7 15C8.76309 15 10.0794 15.5994 11 16.1721V5.45567C10.7989 5.29593 10.5037 5.08245 10.1289 4.86824C9.35493 4.426 8.27622 4 7 4C5.41509 4 4.12989 4.30297 3.33252 4.55749ZM17 15C15.2369 15 13.9206 15.5994 13 16.1721V5.45567C13.2011 5.29593 13.4963 5.08245 13.8711 4.86824C14.6451 4.426 15.7238 4 17 4C18.5849 4 19.8701 4.30297 20.6675 4.55749C20.8684 4.62161 21 4.81078 21 5.02166V14.8991C21 15.233 20.6791 15.4733 20.3545 15.3951C19.4642 15.1807 18.3222 15 17 15Z" ></path> <path d="M2.08735 20.4087C1.86161 19.9047 2.08723 19.3131 2.59127 19.0873C3.05951 18.8792 3.54426 18.7043 4.0318 18.5478C4.84068 18.2883 5.95911 18 7 18C8.16689 18 9.16285 18.6289 9.88469 19.0847C9.92174 19.1081 9.95807 19.131 9.99366 19.1534C10.8347 19.6821 11.4004 20 12 20C12.5989 20 13.1612 19.6829 14.0012 19.1538C14.0357 19.1321 14.0708 19.1099 14.1066 19.0872C14.8291 18.6303 15.8257 18 17 18C18.0465 18 19.1647 18.2881 19.9732 18.548C20.6992 18.7814 21.2378 19.0122 21.3762 19.073C21.8822 19.2968 22.1443 19.8943 21.9118 20.4105C21.6867 20.9106 21.0859 21.1325 20.5874 20.9109C20.1883 20.7349 19.7761 20.5855 19.361 20.452C18.6142 20.2119 17.7324 20 17 20C16.4409 20 15.9037 20.3186 15.0069 20.8841C14.2635 21.3529 13.2373 22 12 22C10.7619 22 9.73236 21.3521 8.98685 20.8829C8.08824 20.3173 7.55225 20 7 20C6.27378 20 5.39222 20.2117 4.64287 20.4522C4.22538 20.5861 3.80974 20.7351 3.4085 20.9128C2.9045 21.1383 2.31305 20.9127 2.08735 20.4087Z" ></path> </g></svg>: This button opens a book viewer on the right-hand side.

![GIF Demo](./screenshots/demo3.gif)

- `{{renderer calibreSync, syncstate, interval, hostlink, lib, id, fmt}}` <svg fill="var(--r-link-color-dark)" height="1.8em" width="1.8em" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>icon/24/sync</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Output-svg" stroke="none" stroke-width="1" fill-rule="evenodd"> <g id="out" transform="translate(-559.000000, -105.000000)"> <path d="M572.163179,108.773986 C571.821387,108.744485 571.549732,108.4688 571.549732,108.114784 L571.549732,106.853349 C571.549732,106.562405 571.226709,106.396587 571.000494,106.571561 L567.254616,109.483035 C566.915787,109.746512 566.9148,110.270414 567.253628,110.533892 L571.000494,113.454521 C571.225721,113.630512 571.549732,113.464694 571.549732,113.17375 L571.549732,112.009974 C571.549732,111.604077 571.903377,111.288718 572.293573,111.348738 C575.032846,111.777016 577.041119,114.496222 576.41483,117.550116 C576.289375,118.162523 576.04933,118.736273 575.72038,119.247968 C575.360808,119.808492 575.504044,120.561284 576.036488,120.949888 L576.057233,120.96413 C576.601531,121.361889 577.377971,121.249987 577.749398,120.678272 C578.537692,119.461598 579,118.001792 579,116.429067 C579,112.402647 575.992036,109.100535 572.163179,108.773986 Z M569.836821,125.226014 C570.178613,125.255515 570.450268,125.5312 570.450268,125.885216 L570.450268,127.146651 C570.450268,127.437595 570.773291,127.603413 570.999506,127.428439 L574.745384,124.516965 C575.084213,124.253488 575.0852,123.729586 574.746372,123.466108 L570.999506,120.545479 C570.774279,120.369488 570.450268,120.535306 570.450268,120.82625 L570.450268,121.990026 C570.450268,122.395923 570.096623,122.711282 569.706427,122.651262 C566.967154,122.222984 564.958881,119.503778 565.58517,116.449884 C565.710625,115.837477 565.95067,115.263727 566.27962,114.752032 C566.639192,114.191508 566.495956,113.438716 565.963512,113.050112 L565.942767,113.03587 C565.398469,112.638111 564.622029,112.750013 564.250602,113.321728 C563.462308,114.538402 563,115.998208 563,117.570933 C563,121.597353 566.007964,124.899465 569.836821,125.226014 Z" id="sync" transform="translate(571.000000, 117.000000) scale(-1, 1) translate(-571.000000, -117.000000) "> </path> </g> </g> </g></svg>: This button initiates the sync process, fetching annotations and applying them to the corresponding blocks in real-time. Click on the button again to stop syncing. Its content can be moved a new location, and only the latest position as recorded by `lastsync` property of the block will be updated.

![GIF Demo](./screenshots/demo5.gif)

## Contribution

After cloning the fork into the local environment, build with:

```sh
npm run install
npm run build
```

Then open Logseq Plugins panel, click on `Load unpacked plugin` and navigate to the repository location. 
