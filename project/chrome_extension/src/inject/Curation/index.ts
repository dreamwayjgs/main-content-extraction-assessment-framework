declare global {
  interface Window { _injected: any; }
}

function getElement(el: Element, name: string) {
  console.log(name, el)
  console.log(typeof (el), el.getAttribute('hyu'))
  const data = {
    name: name,
    hyu: el.getAttribute('hyu'),
    raw: el.outerHTML
  }
  const message = {
    work: 'curation',
    action: 'tagAnswer',
    data: data
  }
  console.log("Sending...", message)
  chrome.runtime.sendMessage(message, response => {
    console.log(response)
  })
}

export function initCuration() {
  console.log("[INIT] Curation Ready")
  window._injected = {
    getElement: getElement
  }
}