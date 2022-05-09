import { inspectPage } from "./inspectPage"

export const initCrawl = async () => {
  console.log("[INFO] Init Crawl")
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    const { section, order } = message
    if (section === 'crawl' && order === 'preprocess') {
      const result = await inspectPage()
      sendResponse(result)
    }
  })
  console.log("[INFO] Ready to Crawl")
}