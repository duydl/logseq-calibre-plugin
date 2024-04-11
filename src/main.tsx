import "@logseq/libs"
import React from 'react'
import ReactDOM from 'react-dom'
import Viewer from './Viewer'
import * as SearchFuncs from './search';
import { clearDriftless, setDriftlessTimeout } from "driftless";
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

const settings: SettingSchemaDesc[] = [
    {
      key: "viewerWidth",
      title: "Adjust viewer width ",
      type: "number",
      default: 40,
      description: 'Value in percentage. Must reopen viewer for change to take effect. Your reading position will be remembered if using Open button. More interactive option will be added in later date.'
    },
    {
      key: "calibreLibrary",
      title: "Preferred Calibre Library",
      description: "Set your preferred Calibre library location.",
      type: "string",
      default: ""
  },
  {
      key: "addBlockInstead",
      title: "Add block instead of page",
      description: "Add a new block at cursor instead of line to new page",
      type: "boolean",
      default: false
  },
  {
      key: "serverLink",
      title: "Content Server Link",
      description: "Specify the link to your content server. The default is localhost:8080, but change it if you use a different port or domain. <br>Add the link WITHOUT the extra /; otherwise it could result in error. <br>If update to library isn't registered, use the link for local home network device i.e the one displayed when clicking on Connect/share in Calibre to avoid the cache problem.",
      type: "string",
      default: "http://localhost:8080"
  },
  {
      key: "pageTitleTemplate",
      title: "Page Title Template",
      description: "Define the template for new Calibre page titles. The default template is 'calibre/{{title}} - {{authors}} ({{date}})'.",
      type: "string",
      default: "calibre/{{title}} - {{authors}} ({{date}})"
  },
  {
      key: "pageProperties",
      title: "Page Properties",
      description: "Select the properties i.e metadata to be included in the new Calibre page. Note that the rating property currently returns an error. The default metadata is 'tags, isbn, date, publisher, language, authors, format'.",
      type: "string",
      default: "tags, isbn, date, publisher, language, authors, format"
  },
  {
      key: "bookFormat",
      title: "Preferred Book Format for Renderers",
      description: "Choose your preferred book format for Viewer Macro and Sync Macro. The default is epub.",
      type: "string",
      default: "epub"
  },
];


async function main() {
  console.log("=== logseq-calibre-annotation Plugin Loaded ===");

  console.log("=== logseq-calibre-metadata Plugin Loaded ===");

  logseq.App.getUserConfigs().then(configs => {
      (configs.preferredThemeMode == "dark") ? document.body.className = "dark-theme" : document.body.className = "light-theme";
  });

  logseq.App.onThemeModeChanged((updated_theme) => {
      (updated_theme.mode == "dark") ? document.body.className = "dark-theme" : document.body.className = "light-theme";
  });

  // toolbar icon
  logseq.provideModel({
    show_settings() {
        logseq.showSettingsUI();
    }
  });
  logseq.App.registerUIItem("toolbar", {
    key: "logseg-calibre-annotation",
    template:
        `<a data-on-click="show_settings" class="button">
            <svg id="calibre-icon" xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-letter-c" width="20" height="20" viewBox="0 0 24 24" stroke-width="2.5" stroke="var(--ls-primary-text-color)" fill="none">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M17 4H12 C11 3 7 6 7 12 C7 18 11 21 12 20 H17" />
            </svg>
        </a>`
  });

  // 0. Metadata 
  // Slash Command
  logseq.Editor.registerSlashCommand("Calibre 2: Add a Calibre book", async () => {
    if (!logseq.settings?.calibreLibrary) {
        logseq.UI.showMsg("calibreMetadata: SET CALIBRE LIBRARY", "warning") 
        return
    }
    // logseq.provideStyle({
    //   // key: 'content-widen-mode', // Not providing key would reset style
    //   style: `
    //   #logseq-calibre-annotation_lsp_main {
    //     position: fixed ;
    //     top: 3rem ;
    //     left: 100% ;
    //     width: 100%;
    //     height: calc(100% - 3rem) ;
    //     z-index: 9;
    //   }
    //   #app-container {
    //     width: 100% ;
    //   }

    //   `,
    // })

    logseq.provideStyle({
      // key: 'content-widen-mode', // Not providing key would reset style
      style: `
      #logseq-calibre-annotation_lsp_main {
        width: 100%;
      }
      #app-container {
        width: 100% ;
      }

      `,
    })
    console.log("TEST5")
    renderSearchbar()
    logseq.showMainUI();
    const search_bar: HTMLInputElement = document.getElementById("search-bar") as HTMLInputElement;
    search_bar.focus();
  });
      
  // 1. MacroRenderer and Model for Viewer Component //

  logseq.App.onMacroRendererSlotted(({ slot, payload }) => {
    const [type, color, link] = payload.arguments
    if (type == "calibreViewer") {
      // Button to open book 
      if (color == "special") { 
        return logseq.provideUI({
          key: type + payload.uuid,
          slot, 
          template: `<button
          data-on-click="showViewer"
          data-src-link="${link}"
          data-slot-id="${slot}"
          data-block-uuid="${payload.uuid}"
          class="ui__button bg-indigo-600 hover:bg-indigo-700 focus:border-indigo-700 active:bg-indigo-700 text-center px-2 py-1 "
          style="font-family: Segoe Print;">Open</button>`,
        })
      }
      else {
        return logseq.provideUI({
            key: type + payload.uuid,
            slot, 
            template: `<button
            data-on-click="showViewer"
            data-src-link="${link}"
            data-slot-id="${slot}"
            data-block-uuid="${payload.uuid}"
            class="button"
            style="width: 1em; height: 1em; background-color: ${color}; border: none; margin: 0;"
          ></button>`,
        })
      }
    }
  });

  logseq.provideModel({
    showViewer(e) {
      // console.log(document.getElementById("right-sidebar"))
      let srcLink = e.dataset.srcLink
      // let blockUuid = e.dataset.blockUuid
      // logseq.App.setRightSidebarVisible(true)
      renderViewer(srcLink)

      logseq.provideStyle({
        // key: 'content-widen-mode', // Not providing key would reset style
        style: `
        #logseq-calibre-annotation_lsp_main {
          position: fixed ;
          top: 3rem ;
          left: ${100 - logseq.settings?.viewerWidth}% ;
          width: ${logseq.settings?.viewerWidth}%;
          height: calc(100% - 3rem) ;
          z-index: 9;
        }

        #logseq-calibre-annotation-test_lsp_main {
          position: fixed ;
          top: 3rem ;
          left: ${100 - logseq.settings?.viewerWidth}% ;
          width: ${logseq.settings?.viewerWidth}% ;
          height: calc(100% - 3rem) ;
          z-index: 9;
        }

        #app-container {
          width: ${100 - logseq.settings?.viewerWidth}% ;
        }

        `,
      })
      logseq.showMainUI()

    },
  });

  // 2. MacroRenderer and Model for Sync Component //

  logseq.App.onMacroRendererSlotted(({ slot, payload }) => {
    const [type, syncstate, interval, hostlink, lib, id, fmt] = payload.arguments
    if (type == "calibreHighlight") {
      if (syncstate == "false") {
        return logseq.provideUI({
            key: type + payload.uuid,
            slot, 
            template: `<button
              data-on-click="update_syncstate"
              data-sync-interval="${interval}"
              data-host-link="${hostlink}"
              data-book-id="${lib}/${id}-${fmt}"
              data-sync-state="false"
              data-slot-id="${slot}"
              data-block-uuid="${payload.uuid}"
              class="ui__button bg-indigo-600 hover:bg-indigo-700 focus:border-indigo-700 active:bg-indigo-700 text-center px-2 py-1 "
              style="font-family: Segoe Print;"
              >Sync</button>`,
              
        
        })
      } else if (syncstate == "true"){
        return logseq.provideUI({
          key: type + payload.uuid,
          slot, 
          template: `<button
            data-on-click="update_syncstate"
            data-sync-state="true"
            data-slot-id="${slot}"
            data-block-uuid="${payload.uuid}"
            class="ui__button text-center px-2 py-1 "
            style="font-family: Segoe Print; background-color: crimson; hover:background-color: white; focus:border-color: red; active:background-color: red;"
            >Stop Syncing</button>`,
      })
      }  
    }
  })

  logseq.provideModel({
    async update_syncstate(e: any) {

      const syncState = e.dataset.syncState;
      const blockUuid  = e.dataset.blockUuid;
      const block = await logseq.Editor.getBlock(blockUuid);
      
      let newContent;

      if (syncState == "true") {
        const flag = `{{renderer calibreHighlight, true,`
        newContent = block?.content?.replace(`${flag}`,
          `{{renderer calibreHighlight, false,`);
        stopSyncing()

      } else if (syncState == "false") {
        const flag = `{{renderer calibreHighlight, false,`
        newContent = block?.content?.replace(`${flag}`,
          `{{renderer calibreHighlight, true,`);
        const syncInterval = e.dataset.syncInterval
        startSyncing(blockUuid, e.dataset.hostLink, e.dataset.bookId, syncInterval)
      }

      if (!newContent) return

      await logseq.Editor.updateBlock(blockUuid, newContent);
    },
  });

};

// 3. Methods for periodically syncing annotations from Calibre to Logseq // 

let intervalId; // Variable to store the interval ID. // Globally defined // Only one book syncing at a time

async function startSyncing(blockUuid, hostLink, bookId, syncInterval) {
  // Clear any existing interval (if there is one)
  clearInterval(intervalId);
  // Set the new interval
  intervalId = setInterval(async () => {
    await fetchUpdate(blockUuid, hostLink, bookId);
  }, syncInterval); // Adjust the interval as needed 

  // Initial fetch and update
  fetchUpdate(blockUuid, hostLink, bookId);
}

function stopSyncing() {
  clearInterval(intervalId);
}

async function fetchUpdate(blockUuid, hostLink, bookId) {
  const lastTimestamp = await logseq.Editor.getBlockProperty(
    blockUuid,
    "lastsync"  
  );
  const parts = bookId.split("/");
  const lib = parts[0];
  const idAndFormat = parts[1].split("-");
  const id = idAndFormat[0];
  const format = idAndFormat[1];

  const lastSync = lastTimestamp ? 
    new Date(lastTimestamp) : new Date(0); // Initialize to the smallest possible date
    console.log(hostLink + "/book-get-annotations/" + bookId)
  const response = await fetch(hostLink + "/book-get-annotations/" + bookId);
  const data = await response.json() as FetchResponse;
  
  const annotations = Object.values(data)[0].annotations_map.highlight;

  const filtered_annotations = annotations
    .map(element => ({
      ...element,
      timestamp: new Date(element.timestamp),
    }))
    .filter(element => !("removed" in element))
    .filter(element => element.timestamp.getTime() > lastSync.getTime() + 1000) // Round up 1 second
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime() ); 

  
  filtered_annotations.forEach(element => {
    logseq.Editor.insertBlock(blockUuid, makeBlock(element, hostLink, lib, id, format), {
      isPageBlock: false,
    });
  });

  if (filtered_annotations.length > 0) {
    const updatedlastTimestamp = filtered_annotations[filtered_annotations.length - 1].timestamp;
    await logseq.Editor.upsertBlockProperty(blockUuid, "lastsync", updatedlastTimestamp);
    logseq.Editor.exitEditingMode();
  }
}

function makeBlock(jsonObject, hostLink, lib, id, fmt) {
  const {
    highlighted_text,
    timestamp,
    start_cfi,
    spine_index,
    style,
    notes
  } = jsonObject;

  let color;
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();
  style.kind == "color" && style.type == "builtin" ? color = style.which : color = "white";
  const note_add = notes ? "\n" + notes : "";

  const markdownString = `{{renderer calibreViewer, ${color}, ${hostLink}/#book_id=${id}&bookpos=epubcfi%28/${(spine_index+1)*2}${start_cfi}%29&fmt=${fmt}&library_id=${lib}&mode=read_book }} ${highlighted_text}${note_add}`;

  return markdownString;
}


// renderViewer // 
function renderViewer(srcLink: string) {
  ReactDOM.render(
    <React.StrictMode>
      <Viewer srcLink={srcLink}/>
    </React.StrictMode>,
    document.getElementById('root')
    
  )
}

function renderSearchbar() {
    ReactDOM.render(
      <div id="search" style={{ position: "absolute", backgroundColor: "transparent", top: "2.5em", boxSizing: "border-box", display: "flex", flexDirection: "column", gap: "0.5em", width: "100vw", height: "100vh", overflow: "auto", zIndex: 100 }}>
        <div id="search-bar-container" >
          <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-letter-c" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="#FF8C00" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
            <path d="M17 4H12 C11 4 7 6 7 12 C7 18 11 20 12 20 H17" />
          </svg>
          <input id="search-bar" type="text" placeholder="Search Calibre library" />
        </div>
        <ul id="search-results">
        </ul>
      </div>,
      document.getElementById('root')
    );
    const search_div = document.getElementById('search') 
      let search_bar: HTMLInputElement = document.getElementById("search-bar") as HTMLInputElement;
      let search_results_item_container: HTMLElement = document.getElementById("search-results") as HTMLElement;
      let typingTimer: number | undefined;
      search_div?.addEventListener("keydown", function (e) {
        if (e.key == "Escape") {
            SearchFuncs.exitSearch();
        }
      });
      search_bar.addEventListener("input", () => {
        if (search_results_item_container) {
            SearchFuncs.clearSearchResults();
            clearDriftless(typingTimer);
            typingTimer = setDriftlessTimeout(() => {
                if (search_bar.value) {
                  SearchFuncs.getCalibreItems(search_bar.value);
                }
            }, 750);
        }
    });
  }


interface Highlight {
  type: string;
  timestamp: string;
  uuid: string;
  highlighted_text: string;
  start_cfi: string;
  end_cfi: string;
  style: {
    type: string;
    kind: string;
    which: string;
  };
  spine_name: string;
  spine_index: number;
  toc_family_titles: string[];

  removed: boolean;
  notes: string;
}

interface AnnotationsMap {
  highlight: Highlight[];
}

interface AnnotationsData {
  last_read_positions: any[];
  annotations_map: AnnotationsMap;
}

interface FetchResponse {
  [key: string]: AnnotationsData;
}


logseq.useSettingsSchema(settings).ready(main).catch(console.error)