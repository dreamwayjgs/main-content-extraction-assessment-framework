import $ from 'jquery'

export class LocalConfig {
  host: string
  mhtmlApi: string
  static instance: LocalConfig
  constructor() {
    this.host = process.env.HOST || ''
    this.mhtmlApi = process.env.MHTML_API || ''
    console.log("Server URLs", this.host, this.mhtmlApi)
  }
  static getInstance() {
    if (!LocalConfig.instance) {
      LocalConfig.instance = new LocalConfig()
    }
    return LocalConfig.instance
  }
  init() {
    chrome.storage.sync.get(['host', 'mhtmlApi', 'pythonApi'], items => {
      if (items.host !== undefined && items.host !== '') this.host = items.host;
      console.log("HOST init", this.host)
      if (items.mhtmlApi !== undefined && items.host !== '') this.mhtmlApi = items.mhtmlApi;
      console.log("MHTML_API init", this.mhtmlApi)
    })
  }
  setToEnv() {
    chrome.storage.sync.set({ host: process.env.HOST })
    chrome.storage.sync.set({ mhtmlApi: process.env.MHTML_API })
    console.log('Server URL reset')
  }
}


export function falsyFilter<T>(arr: (T | null | undefined | false | '')[]) {
  return arr.filter((e): e is T => !!e)
}

export function reduceWhiteSpace(s?: string | null) {
  return s ? s.trim().replace(/\s\s+/g, ' ') : ''
}

interface NodeIteratorConfig {
  showText?: boolean
  filter?: NodeFilter | null
  visibleOnly?: boolean
}

function isVisible(el: HTMLElement) {
  var style = window.getComputedStyle(el);
  const size = el.getBoundingClientRect().width * el.getBoundingClientRect().height
  return $(el).is(":visible") &&
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    size > 0 &&
    parseFloat(style.opacity) > 0.2
}

export function nodesUnder(el?: Node, config: NodeIteratorConfig = {
  showText: false, filter: null, visibleOnly: false
}) {
  const nodes = []
  const { showText, filter, visibleOnly } = config
  console.log("NODE_UNDER_CONFIG", config)
  const root = el ? el : document.body
  const walker = document.createNodeIterator(root, showText ? NodeFilter.SHOW_TEXT : NodeFilter.SHOW_ELEMENT, filter);
  let node
  while (node = walker.nextNode()) {
    if (visibleOnly) {
      if (isVisible(node as HTMLElement)) {
        nodes.push(node);
      }
    }
    else nodes.push(node);
  }
  return nodes;
}

export function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}
