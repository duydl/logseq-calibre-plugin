import "@logseq/libs"
import React from 'react'
import ReactDOM from 'react-dom'
import Viewer from './Viewer'
import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

const settings: SettingSchemaDesc[] = [
  {
    key: "viewerWidth",
    title: "Adjust Viewer Width in %",
    type: "number",
    default: 50,
    description: ''
  },
];



async function main() {
  console.log('=== logseq-calibre-annotation Plugin Loaded ===')

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
          top: 0% ;
          left: ${100 - logseq.settings?.viewerWidth}% ;
          width: ${logseq.settings?.viewerWidth}%;
          height: 100% ;
          z-index: 9;
        }

        #logseq-calibre-annotation-test_lsp_main {
          position: fixed ;
          top: 0% ;
          left: ${100 - logseq.settings?.viewerWidth}% ;
          width: ${logseq.settings?.viewerWidth}% ;
          height: 100% ;
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