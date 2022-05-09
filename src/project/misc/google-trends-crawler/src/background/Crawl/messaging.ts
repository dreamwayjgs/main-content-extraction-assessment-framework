export const requestPreprocess = async (tabId: number): Promise<string[]> => {
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