import { inspectPage } from "./inspectPage"

function DOMtoString(document_root: any) {
  var html = '',
    node = document_root.firstChild;
  while (node) {
    switch (node.nodeType) {
      case Node.ELEMENT_NODE:
        html += node.outerHTML;
        break;
      case Node.TEXT_NODE:
        html += node.nodeValue;
        break;
      case Node.CDATA_SECTION_NODE:
        html += '<![CDATA[' + node.nodeValue + ']]>';
        break;
      case Node.COMMENT_NODE:
        html += '<!--' + node.nodeValue + '-->';
        break;
      case Node.DOCUMENT_TYPE_NODE:
        // (X)HTML documents are identified by public identifiers
        html += "<!DOCTYPE " + node.name + (node.publicId ? ' PUBLIC "' + node.publicId + '"' : '') + (!node.publicId && node.systemId ? ' SYSTEM' : '') + (node.systemId ? ' "' + node.systemId + '"' : '') + '>\n';
        break;
    }
    node = node.nextSibling;
  }
  return html;
}

function createTempFileForLargeData(data: string, id: string): string {
  const tempFile = new File([data], `${id}.json`, { type: "text/json;charset=utf-8" })
  const localDataPath = window.URL.createObjectURL(tempFile)
  return localDataPath
}
export async function initCrawl() {
  console.log("[INIT] Crawl ready")
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (chrome.runtime.lastError) {
      sendResponse({
        status: 'error',
        error: chrome.runtime.lastError.message
      })
    }
    const { taskName } = message
    if (taskName === 'crawl') {
      // TODO: Handle with the document preprocess

      // TODO: Retrun data to background script
      // sendResponse({
      //   status: 'ok',
      // })
      // EXAMPLE START
      const elements = await inspectPage()
      const data = JSON.stringify({
        rawHtml: DOMtoString(document),
        elements: elements
      })
      sendResponse({
        status: 'ok',
        localDataPath: createTempFileForLargeData(data, message.id)
      })
      // EXAMPLE END
    }
    return true
  })
  console.log("[INFO] Ready to Crawl")
}