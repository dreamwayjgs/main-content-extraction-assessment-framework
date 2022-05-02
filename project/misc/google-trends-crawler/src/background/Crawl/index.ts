
import { HOST } from ".."
import { POST_Form } from "../utils/api"
import { requestPreprocess } from "./messaging"
import { pageCapture } from "./pageCapture"

const crwalCurrentPage = async (info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) => {
  const tabId = tab.id
  if (tabId === undefined || tabId === chrome.tabs.TAB_ID_NONE || tab.url === undefined) {
    alert("저장할 수 없는 페이지입니다")
    return
  }
  const data = {
    url: tab.url,
    elements: JSON.stringify(await requestPreprocess(tabId)),
    mhtml: await pageCapture(tabId)
  }
  // await POST_Form(HOST, 'crawl', data)
  // await POST(HOST, 'crawl', data)  
}

export const addCrawlMenu = () => {
  chrome.contextMenus.create({
    id: 'CrawlMenu',
    title: 'Saving pages'
  })

  chrome.contextMenus.create({
    id: 'CrawlCurrentPage',
    title: 'Save current page in MHtml',
    onclick: crwalCurrentPage,
    parentId: 'CrawlMenu'
  })
}