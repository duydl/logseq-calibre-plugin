import "@logseq/libs";
import Fuse from "fuse.js";
import DigestClient from "digest-fetch";


export async function getCalibreItems(search_input: string): Promise<void> {
    const calibreLibrary = logseq.settings?.calibreLibrary.replace(/ /g, '_');
    let fetch_link = `${logseq.settings?.serverLink}/ajax/books/${calibreLibrary}`;
  
    // Check for double slashes in the URL (excluding the `http://` or `https://` part)
    const client = new DigestClient(logseq.settings?.username, logseq.settings?.password);
    fetch_link = fetch_link.replace(/([^:]\/)\/+/g, '$1');
  
    console.log(fetch_link);
  
    try {
        const response = await client.fetch(fetch_link);
        // const response = await client.fetch(fetch_link);
  
    if (!response.ok) {
        logseq.UI.showMsg("Request to Calibre Content Server failed.", "error");
        console.log(response);
        return;
    }
  
    const data = await response.json();
    const books: CalibreItem[] = Object.values(data);
    const options = {
        threshold: 0.2,
        keys: ["title", "authors"],
        distance: 1000,
      };
    const fuse = new Fuse<CalibreItem>(books, options);
    const search_results: Fuse.FuseResult<CalibreItem>[] = fuse.search(search_input);
  
    searchCalibreItems(search_results);
    } catch (error) {
        console.error('Fetch or other error:', error);
        logseq.UI.showMsg("calibreMetadata: Fail to fetch from Calibre API. Make sure to start the Content Server.", "error");
    }
  }


function setAttributes(element, attrs) {
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
}

export function exitSearch() {
    let search_bar: HTMLInputElement = document.getElementById("search-bar") as HTMLInputElement;
    
    search_bar.value = "";
    search_bar.blur();
    clearSearchResults();
    logseq.provideStyle({
        style: `
        #app-container {
          width: 100% ;
        }
        `,
      })
    logseq.hideMainUI();
}

export function clearSearchResults() {
    let search_results_item_container: HTMLElement = document.getElementById("search-results") as HTMLElement;
    if (search_results_item_container.children.length > 0) {
        for (let i = 0; i < search_results_item_container.children.length; i++) {
            (search_results_item_container.children[i]).remove();
            clearSearchResults();
        }
    }
}

// search_results: a list of dictionaries with one key "item" and value metadata of 1 book.
function searchCalibreItems(search_results) {

    let calibre_item;
    let calibre_item_key;
    let calibre_item_title;
    let calibre_item_authors;
    let calibre_item_date;

    let search_result_container;
    let search_result_title_container;
    let search_result_title;
    let search_result_description_container;
    let search_result_description;
    let search_results_item_container: HTMLElement = document.getElementById("search-results") as HTMLElement;
    let search_bar: HTMLInputElement = document.getElementById("search-bar") as HTMLInputElement;
            
    if (search_results.length > 0) {
        // display search results
        for (let i = 0; i < search_results.length; i++) {
            
            calibre_item = search_results[i].item; // fuse.js return in the form [item: {} , etc..]

            calibre_item_key = calibre_item.application_id;
            calibre_item_title = calibre_item.title;
            calibre_item_authors = calibre_item.authors.join(" & ")
            calibre_item_date = calibre_item.pubdate.substring(0, 4)

            const hr = document.createElement("hr");

            search_result_container = document.createElement("li");
            search_result_container.id = calibre_item_key;

            search_result_title_container = document.createElement("div");
            search_result_title_container.id = calibre_item_key;
            search_result_title = document.createTextNode(`${calibre_item_title} `);

            search_result_description_container = document.createElement("div");
            search_result_description_container.id = calibre_item_key;
            search_result_description = document.createTextNode(`${calibre_item_authors} (${calibre_item_date})`);

            setAttributes(search_result_container, {
                "class": "search-result",
                "style": "cursor: pointer;"
            });
            setAttributes(search_result_title_container, {
                "class": "title"
            });
            setAttributes(search_result_description_container, {
                "class": "info"
            });
            search_result_container.addEventListener("click", function (e) {
                let selected_item;
                // Iterate through the list and find the inner dictionary with application_id = e.srcElement.id
                for (const search_result of search_results) {
                    if (search_result.item && search_result.item.application_id == e.srcElement.id) {
                        selected_item = search_result.item;
                        break; // Exit the loop once the desired dictionary is found
                    }
                }
                exitSearch();
                createCalibrePage(selected_item);
            });
            search_result_title_container.appendChild(search_result_title);
            search_result_description_container.appendChild(search_result_description);

            search_result_container.append(search_result_title_container, search_result_description_container);

            // Append <hr> except for the last item
            (i != (search_results.length - 1)) ? search_results_item_container.append(search_result_container, hr) : search_results_item_container.append(search_result_container);
        }
    }
    
    else if ((search_results.length == 0) && (search_bar.value != "")) {
        // Not found
        search_result_container = document.createElement("li");
        search_result_title_container = document.createElement("div");
        search_result_title = document.createTextNode("Not found");

        setAttributes(search_result_title_container, {
            "class": "title"
        });

        search_result_title_container.appendChild(search_result_title);
        search_result_container.append(search_result_title_container);
        search_results_item_container.append(search_result_container);
    }
}

function createCalibrePage(item) {
    
    const calibre_item = item;

    let page_title = logseq.settings?.pageTitleTemplate;
    let page_title_variables = page_title.match(/({{[\s\S]*?}})/gm);

    page_title_variables.forEach(page_title_var => {
        switch (page_title_var) {

            case "{{authors}}":
            (calibre_item.authors) ? page_title = page_title.replace("{{authors}}", calibre_item.authors.join(" & ")) : page_title = page_title;
            break;

            case "{{title}}":
            (calibre_item.title) ? page_title = page_title.replace(page_title_var, calibre_item.title) : page_title = page_title.replace(page_title_var, "NA");
            break;

            case "{{date}}":
            (calibre_item.pubdate) ? page_title = page_title.replace(page_title_var, calibre_item.pubdate.substring(0, 4)) : page_title = page_title;
            break;
        }
    });

    let property_value;
    let page_properties_keys = logseq.settings?.pageProperties.split(",");
    let page_properties = {};

    // // Add Everything 
    // for (let [key, value] of Object.entries(calibre_item)) {
    //     (value) ? page_properties[key] = `"${value}"` : page_properties[key] = "NA";
    // }
    
    page_properties_keys.forEach((property) => {
        property = property.trim()
        switch (property) {
            case "tags":
            property_value = calibre_item.tags;
            break;

            case "isbn":
            property_value = calibre_item.identifiers.isbn;
            break;

            case "date":
            property_value = calibre_item.pubdate.substring(0, 4);
            break;

            case "publisher":
            property_value = calibre_item.publisher;
            break;
            
            case "languages":
            property_value = calibre_item.languages;
            break;

            case "authors":
            property_value = calibre_item.authors.map(author => `[[${author}]]`).join(', ');;
            break;

            case "format":
            property_value = Object.entries(calibre_item.format_metadata)
            .map(([ext, obj]) => `[${ext}](${obj?.path})`)
            .join(', ');
            break;

            default:
            property_value = calibre_item[property];
        }
        
        page_properties[property] = property_value ? property_value : "NA";
        });

        console.log("Create Page");
        create(page_title, page_properties, calibre_item).then(() => {
    });

}


async function create(page_title, page_properties, calibre_item) {

    if (logseq.settings?.addBlockInstead) {
        
        const currentBlock = await logseq.Editor.getCurrentBlock()
        const newBlock = await logseq.Editor.insertBlock(currentBlock.uuid, `${page_title}`, {
            before: true,
            focus: true,
            isPageBlock: true,
            properties: page_properties,
        })
        
        // await logseq.Editor.insertAtEditingCursor(`${page_title}`);
        // Object.entries(page_properties).forEach(([key, value]) => logseq.Editor.upsertBlockProperty(currentBlock.uuid, key, value))

        const synopsisBlock = await logseq.Editor.insertBlock(newBlock.uuid, "[[Synopsis]]");

        await logseq.Editor.insertBlock(synopsisBlock.uuid, calibre_item?.comments? calibre_item?.comments : "");
        
        const calibreLibrary = logseq.settings?.calibreLibrary.replace(/ /g, '_');
        // Append two MacroRenderers for View and Sync in calibre-annotation Plugin
        await logseq.Editor.insertBlock(newBlock.uuid, `[${calibre_item.title}](calibre://show-book/${calibreLibrary}/${calibre_item.application_id})  {{renderer calibreViewer, special, ${logseq.settings?.serverLink}/#book_id=${calibre_item.application_id}&fmt=${logseq.settings?.bookFormat}&library_id=${calibreLibrary}&mode=read_book}} {{renderer calibreHighlight, false, 2000, ${logseq.settings?.serverLink}, ${calibreLibrary}, ${calibre_item.application_id}, ${logseq.settings?.bookFormat}}}`);
    }
    else {
        const newPage = await logseq.Editor.createPage(page_title, page_properties, {
            format: "markdown",
            redirect: false,
            journal: false,
            createFirstBlock: false
        });

        logseq.Editor.insertAtEditingCursor(`[[${page_title}]]`);
        logseq.Editor.exitEditingMode();


        const synopsisBlock = await logseq.Editor.appendBlockInPage(newPage?.uuid, "[[Synopsis]]");

        await logseq.Editor.insertBlock(synopsisBlock.uuid, calibre_item?.comments? calibre_item?.comments : "");

        // Append two MacroRenderers for View and Sync in calibre-annotation Plugin
        const calibreLibrary = logseq.settings?.calibreLibrary.replace(/ /g, '_');
        await logseq.Editor.prependBlockInPage(newPage?.uuid, `[${calibre_item.title}](calibre://show-book/${calibreLibrary}/${calibre_item.application_id})  {{renderer calibreViewer, special, ${logseq.settings?.serverLink}/#book_id=${calibre_item.application_id}&fmt=${logseq.settings?.bookFormat}&library_id=${calibreLibrary}&mode=read_book}} {{renderer calibreHighlight, false, 2000, ${logseq.settings?.serverLink}, ${calibreLibrary}, ${calibre_item.application_id}, ${logseq.settings?.bookFormat}}}`);
    }

}


interface CalibreItem {
    application_id: string;
    title: string;
    authors: string[];
    pubdate: string;
    tags?: string[];
    identifiers?: {
      isbn?: string;
    };
    publisher?: string;
    languages?: string[];
    format_metadata: { [key: string]: { path: string } };
    comments?: string;
  }
  
  // Type for search results from Fuse.js
  interface SearchResult {
    item: CalibreItem;
  }