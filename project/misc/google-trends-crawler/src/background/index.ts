import { POST } from "./utils/api"

export const HOST = process.env.HOST || ''

console.log("HOST 확인", HOST)

const requestPreprocess = async (tabId: number): Promise<string[]> => {
  console.log("[MSG] 전처리")
  return new Promise<string[]>(resolve => {
    chrome.tabs.sendMessage(tabId, {
      section: 'crawl',
      order: 'preprocess'
    }, response => {
      console.log("전처리 완료 인 백그라운드", typeof (response), response.length)
      resolve(response)
    })
  })
}

async function requestKeywords(info: chrome.contextMenus.OnClickData, tab: chrome.tabs.Tab) {
  const tabId = tab.id
  if (tabId === undefined || tabId === chrome.tabs.TAB_ID_NONE || tab.url === undefined) {
    alert("저장할 수 없는 페이지입니다")
    return
  }
  const data = await requestPreprocess(tabId)
  console.log(data)
  await POST(HOST, '/crawl/seed/google', {
    data: data,
    url: tab.url,
    msg: 'google trends'
  })
}

function main() {
  chrome.contextMenus.create({
    id: 'CrawlKeywords',
    title: 'Crawl Google Trends keywords',
    onclick: requestKeywords
  })
}

main()