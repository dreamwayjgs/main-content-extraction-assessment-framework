export async function pageCapture(tabId: number) {
  const mhtml = new Promise<Blob>((resolve, reject) => {
    chrome.pageCapture.saveAsMHTML({ tabId: tabId }, async (mhtmlData: Blob) => {
      if (chrome.runtime.lastError) {
        console.warn("[WARN] Cannot Crawled", chrome.runtime.lastError.message)
        reject(chrome.runtime.lastError.message)
      }
      resolve(mhtmlData)
    })
  })
  return mhtml
}

export async function pageScreenshot(tab: chrome.tabs.Tab) {

}