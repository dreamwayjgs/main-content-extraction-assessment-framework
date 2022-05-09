import { LocalConfig } from "../../common"
import { CurationConfig } from "../../common/configs/curation";
import { Page } from "../../types";
import { Task, TaskManager } from "../../types/task";


export class Curation extends Task {
  constructor(
    public tabId: number,
    public pages: Page[],
    public config: CurationConfig,
    public requestCallback?: {},
    public responseCallback?: (task: any, message: any, sendResponse?: (response: any) => void) => Promise<void>
  ) {
    super(tabId, pages, config, undefined, responseCallback)
    chrome.contextMenus.create({
      id: `CurationPrev-${tabId}`,
      title: `Prev ${tabId}`,
      parentId: 'CurationControl',
      onclick: this.prev
    })
    chrome.contextMenus.create({
      id: `CurationNext-${tabId}`,
      title: `Next ${tabId}`,
      parentId: 'CurationControl',
      onclick: this.next
    })
  }
  start() {
    this.load()
  }
  load() {
    const id = this.currentPage.id
    chrome.tabs.update(this.tabId, { url: `${LocalConfig.getInstance().mhtmlApi}/${id}.mhtml` })
  }
  prev() {
    const prev = this.pageGenerator.next('prev')
    if (!prev.done) {
      this.currentPage = prev.value
      this.load()
    }
  }
  next() {
    const next = this.pageGenerator.next()
    if (next.done) {
      console.log('<<< Curation END >>>')
      this.status = 'finished'
      TaskManager.getInstance().destroy(this.tabId)
    } else {
      this.currentPage = next.value
      this.load()
    }
  }

  attachEvents() {
    chrome.runtime.onMessage.addListener(Curation.curate)
    chrome.runtime.onMessage.addListener(Curation.keyBrowse)
  }
  checkEvents() {

  }
  detachEvents() {
    chrome.runtime.onMessage.removeListener(Curation.curate)
    chrome.runtime.onMessage.removeListener(Curation.keyBrowse)
  }
  static getTask(tabId: number) {
    const { task, taskType } = TaskManager.getInstance().getTaskByTabId<Curation>(tabId)
    if (taskType === Curation.getClassName()) return task;
    return false
  }
  static curate(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
    const tabId = sender.tab ? sender.tab.id : chrome.tabs.TAB_ID_NONE
    if (tabId === chrome.tabs.TAB_ID_NONE || tabId === undefined) {
      console.warn("Unknown message", sender)
      return false
    }
    const { work, action } = message
    const task = Curation.getTask(tabId)
    if (task && work === 'curation') {
      console.log("[Curation] Message from tab", tabId, message)
      if (typeof task.responseCallback === 'function') {
        task.responseCallback(task, message, sendResponse)
        return true
      }
    }
  }
  static async keyBrowse(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
    if (sender.tab && sender.tab.id) {
      const task = Curation.getTask(sender.tab.id)
      if (task) {
        const { action, work } = message
        if (action === 'next') task.next()
        if (action === 'prev') task.prev()
      }
    }
  }
}