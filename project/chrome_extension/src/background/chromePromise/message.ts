export const requestContentScript = async (tabId: number, message: any): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    chrome.tabs.sendMessage(tabId, message, response => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message)
        return
      }
      resolve(response)
    })
  })
}

export const requestExternalMessage = async (extId: string, message: any): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    chrome.runtime.sendMessage(extId, message, response => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message)
        return
      }
      resolve(response)
    })
  })
}