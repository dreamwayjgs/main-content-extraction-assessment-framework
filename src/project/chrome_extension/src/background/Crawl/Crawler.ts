import { Page } from "../../types"
import { requestContentScript } from "../chromePromise"
import { CrawlConfig, TASK_NAME_CRAWL, getCrawlConfig } from "../../common/configs/crawl"
import { Task } from "../../types/task"

export class Crawler extends Task {
  public runner: Generator<Page, void, unknown>
  public cursor: Page
  public loadTimedOut = false
  public loadTimeoutId?: NodeJS.Timeout
  constructor(
    public tabId: number,
    public pages: Page[],
    public config: CrawlConfig,
    public requestCallback?: any,
    public responseCallback?: (task: any, message: any, sendResponse?: (response: any) => void) => Promise<void>
  ) {
    super(tabId, pages)
    this.runner = this.run()
    const start = this.runner.next()
    console.log('Crawl config:', config)
    if (!start.done) this.cursor = start.value
    else throw Error("Page length is 1")
  }
  static async create(pages: Page[], requestCallback?: any, responseCallback?: (task: Crawler, data: any) => Promise<void>) {
    return new Promise<Crawler>((resolve, reject) => {
      chrome.tabs.create({ active: true }, tab => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        getCrawlConfig().then(config => {
          resolve(new Crawler(tab.id!, pages, config, requestCallback, responseCallback))
        }).catch(reason => {
          console.log("Cannot get configuration")
        })
      })
    })
  }
  async startOnNewTab() {
    console.log("Start Crawl on new tab. Mode:", this.config.watch)
    chrome.webNavigation.onCommitted.addListener(this.requestOnTimeout)
    chrome.webNavigation.onCompleted.addListener(this.requestOnComplete)
    chrome.webNavigation.onErrorOccurred.addListener(this.skipFaultyPage)
    await this.open(this.cursor.url)
  }

  *run() {
    for (const [index, page] of Object.entries(this.pages)) {
      yield page
    }
    console.log("Event detach", chrome.webNavigation.onCommitted.hasListener(this.requestOnTimeout))

    chrome.webNavigation.onCommitted.removeListener(this.requestOnTimeout)
    chrome.webNavigation.onCompleted.removeListener(this.requestOnComplete)
    chrome.webNavigation.onErrorOccurred.removeListener(this.skipFaultyPage)
    console.info("CRAWL FINISHED")
  }

  detachEvents() {
    console.log("Crawl force stop", this.tabId)
    chrome.webNavigation.onCommitted.removeListener(this.requestOnTimeout)
    chrome.webNavigation.onCompleted.removeListener(this.requestOnComplete)
    chrome.webNavigation.onErrorOccurred.removeListener(this.skipFaultyPage)
    console.info("CRAWL FINISHED")
  }

  async next() {
    const next = this.runner.next()
    if (!next.done) {
      this.cursor = next.value
      await this.open(this.cursor.url)
    }
  }

  open(url: string) {
    return new Promise<void>((resolve, reject) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message))
      }
      console.info(`Moving... ${url}`)
      chrome.tabs.update(this.tabId, { url: url }, () => {
        console.info(`Moved ${url}`)
        resolve()
      })
    })
  }

  skipFaultyPage = async (details: chrome.webNavigation.WebNavigationFramedErrorCallbackDetails) => {
    const frameId = details.frameId
    if (frameId !== 0) return;
    if (!(details.url.startsWith('http') || details.url.startsWith('https'))) return;

    console.log("Error on ", details.tabId)
    console.log("by", details.error)
    const ignorableErrorList = ['net::ERR_ABORTED']
    if (!ignorableErrorList.includes(details.error)) {
      if (this.loadTimeoutId) clearTimeout(this.loadTimeoutId);
      await this.next()
    }
  }

  requestOnTimeout = async (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
    const frameId = details.frameId
    if (frameId !== 0) return;
    if (!(details.url.startsWith('http') || details.url.startsWith('https'))) return;

    this.loadTimeoutId = setTimeout(async () => {
      this.loadTimedOut = true
      console.warn("CRAWL: Something wrong but try anyway")
      await this.crawl()
    }, this.config.timeoutAfterOpen)
  }

  requestOnComplete = async (details: chrome.webNavigation.WebNavigationFramedCallbackDetails) => {
    const frameId = details.frameId
    if (frameId !== 0) return;
    if (!(details.url.startsWith('http') || details.url.startsWith('https'))) return;

    console.info("CRAWL: LOAD EVENT fired. waiting...", this.loadTimeoutId, details)
    if (this.loadTimeoutId) clearTimeout(this.loadTimeoutId);
    setTimeout(async () => {
      console.info("CRAWL!")
      await this.crawl()
    }, this.config.timeoutAfterLoad)
  }

  crawl = async () => {
    console.log("CRAWL: Crawling...", this.tabId, this.cursor.url)
    try {
      const response = typeof this.requestCallback === 'function' ?
        await this.requestCallback(this.tabId, this.cursor.id) :
        await requestContentScript(this.tabId, {
          taskName: TASK_NAME_CRAWL,
          id: this.cursor.id,
          ...this.requestCallback
        })

      if (this.responseCallback) await this.responseCallback(this, response)
      if (this.config.auto) await this.next()
    }
    catch (err) {
      console.error("Crawl Failed", err)
      if (this.config.auto) await this.next()
    }
  }
}