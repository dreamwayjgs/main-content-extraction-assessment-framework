import { Page } from "../../types";
import { Task, TaskManager } from "../../types/task";
import { getRandomInt, LocalConfig } from "../../common";
import { requestContentScript } from "../chromePromise";
import { sleep } from "../utils";
import { ExtractionConfig, TASK_NAME_EXTRACTION } from "../../common/configs/extraction";

export class Extraction extends Task {
  constructor(
    public tabId: number,
    public pages: Page[],
    public config: ExtractionConfig,
    public requestCallback?: {},
    public responseCallback?: (task: any, message: any, sendResponse?: (response: any) => void) => Promise<void>
  ) {
    super(tabId, pages, config, requestCallback, responseCallback)
    this.attachControls()
  }
  start() {
    console.log("RUN WITH CONFIGURATIONS:", this.config)
    this.load()
  }
  load() {
    chrome.tabs.update(this.tabId, { url: `${LocalConfig.getInstance().mhtmlApi}/${this.currentPage.id}.mhtml` })
  }
  attachEvents() {
    chrome.webNavigation.onCompleted.addListener(Extraction.extractOnLoad)
    chrome.runtime.onMessage.addListener(Extraction.keyBrowse)
    chrome.runtime.onMessage.addListener(Extraction.reportExtraction)
  }
  detachEvents() {
    chrome.webNavigation.onCompleted.removeListener(Extraction.extractOnLoad)
    chrome.runtime.onMessage.removeListener(Extraction.keyBrowse)
    chrome.runtime.onMessage.removeListener(Extraction.reportExtraction)
  }
  static getTask(tabId: number) {
    const { task, taskType } = TaskManager.getInstance().getTaskByTabId<Extraction>(tabId)
    if (taskType === Extraction.getClassName()) return task;
    return undefined
  }
  static async extractOnLoad(details: chrome.webNavigation.WebNavigationFramedCallbackDetails) {
    const frameId = details.frameId
    if (frameId !== 0) return;

    const tabId = details.tabId
    const task = Extraction.getTask(tabId)
    if (task) {
      console.log("[EXTRACTION] Extracting", task.currentPage.id, task.requestCallback)
      const response = typeof task.requestCallback === 'function' ?
        await task.requestCallback(task.tabId, task.currentPage.id) :
        await requestContentScript(task.tabId, {
          taskName: TASK_NAME_EXTRACTION,
          id: task.currentPage.id,
          ...task.requestCallback
        })
      if (task.responseCallback) {
        console.log("[EXTRACTION] Job done immediately in page id:", task.currentPage.id)
        await task.responseCallback(task, response)
      }
      if (task.config.auto) {
        await sleep(100 + getRandomInt(1000))
        task.next()
      }
    }
  }
  static async reportExtraction(message: any, sender: chrome.runtime.MessageSender) {
    if (chrome.runtime.lastError) {
      console.error("[EXTRACTION] Error on sending result: " + chrome.runtime.lastError.message)
    }
    console.log("Pending job done", message)
    if (sender.tab && sender.tab.id) {
      const task = Extraction.getTask(sender.tab.id)
      if (task) {
        const { taskName } = message
        if (taskName === 'extraction') {
          console.log("[EXTRACTION] Pending Job done in page id:", task.currentPage.id)
          if (typeof task.responseCallback === 'function') task.responseCallback(task, message);
        }
      }
    }
  }
  static async keyBrowse(message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) {
    if (chrome.runtime.lastError) {
      console.error("Error on browsing with the keyboard", chrome.runtime.lastError)
    }
    if (sender.tab && sender.tab.id) {
      const task = Extraction.getTask(sender.tab.id)
      if (task) {
        const { action, request } = message
        if (action === 'next') task.next()
        if (action === 'prev') task.prev()
      }
    }
  }
}
