class tabs {
  static create() {
    return new Promise<chrome.tabs.Tab>((resolve, reject) => {
      chrome.tabs.create({ active: true }, tab => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        resolve(tab)
      })
    })
  }
}

export default tabs