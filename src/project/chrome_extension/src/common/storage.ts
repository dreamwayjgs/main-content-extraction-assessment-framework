export async function getSync(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(key, items => {
      if (chrome.runtime.lastError)
        reject(chrome.runtime.lastError.message)
      if (items[key] === undefined) resolve('')
      else resolve(items[key])
    })
  })
}

export async function setSync(item: { [key: string]: any }): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set(item, () => {
      if (chrome.runtime.lastError)
        reject(chrome.runtime.lastError.message)
      resolve()
    })
  })
}

export async function getLocal(key: string): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, items => {
      if (chrome.runtime.lastError)
        reject(chrome.runtime.lastError.message)
      resolve(items[key])
    })
  })
}

export async function setLocal(item: { [key: string]: any }): Promise<void> {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(item, () => {
      if (chrome.runtime.lastError)
        reject(chrome.runtime.lastError.message)
      resolve()
    })
  })
}