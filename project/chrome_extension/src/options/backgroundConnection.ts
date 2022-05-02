export function requestBackground(message: any): void {
  console.log("requestBackground", message)
  chrome.runtime.sendMessage(message)
}

export function generateLinks(message: any) {
  const { request, sourceName, text } = message
  const link = document.createElement('a')
  link.onclick = () => {
    requestBackground({
      request: request,
      sourceName: sourceName
    })
  }
  link.href = '#'
  link.innerText = text
  return link
}