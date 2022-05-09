import { filter, find } from "lodash"
import { Page } from "../../types"
import { Task, TaskManager } from "../../types/task"
import { LocalConfig } from "../../common"
import { requestContentScript } from "../chromePromise"
import { GET, POST } from "../utils"
import { EvaluationConfig, getEvaluationConfig, TASK_NAME_EVALUATION } from "../../common/configs/evaluation"

export class Evaluation extends Task {
  constructor(
    public tabId: number,
    public pages: Page[],
    public config: EvaluationConfig,
    public requestCallback?: any,
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
    if (this.config.openOrigin) chrome.tabs.update(this.tabId, { url: this.currentPage.url });
    else chrome.tabs.update(this.tabId, { url: `${LocalConfig.getInstance().mhtmlApi}/${this.currentPage.id}.mhtml` });
  }
  check(message: any) { }
  attachEvents() {
    console.log(`Attach ${TASK_NAME_EVALUATION} Events on ${this.tabId}`)
    chrome.webNavigation.onCompleted.addListener(Evaluation.evalOnLoad)
    chrome.runtime.onMessage.addListener(Evaluation.keyBrowse)
  }
  detachEvents() {
    console.log(`Detach ${TASK_NAME_EVALUATION} Events on ${this.tabId}`)
    chrome.webNavigation.onCompleted.removeListener(Evaluation.evalOnLoad)
    chrome.runtime.onMessage.removeListener(Evaluation.keyBrowse)
  }
  static getTask(tabId: number) {
    const { task, taskType } = TaskManager.getInstance().getTaskByTabId<Evaluation>(tabId)
    if (taskType === Evaluation.getClassName()) {
      return task
    }
    return undefined
  }
  static async evalOnLoad(details: chrome.webNavigation.WebNavigationFramedCallbackDetails) {
    const frameId = details.frameId
    if (frameId !== 0) return;

    const tabId = details.tabId
    const task = Evaluation.getTask(tabId)
    if (task) {
      console.log("[EVALUATION]", task.currentPage.id)
      const response = typeof task.requestCallback === 'function' ?
        await task.requestCallback(task.tabId, task.currentPage.id) :
        await requestContentScript(task.tabId, {
          taskName: TASK_NAME_EVALUATION,
          id: task.currentPage.id,
          ...task.requestCallback
        })
      if (task.responseCallback) {
        console.log("[EVALUATION] Job done immediately in page id:", task.currentPage.id)
        await task.responseCallback(task, response)
      }
      if (task.config.auto) {
        task.next()
      }
    }
  }
  static async keyBrowse(message: any, sender: chrome.runtime.MessageSender) {
    console.log(sender.tab)
    if (sender.tab && sender.tab.id) {
      const task = Evaluation.getTask(sender.tab.id)
      if (task) {
        const { action, request } = message
        if (action === 'next') task.next()
        if (action === 'prev') task.prev()
        if (action === 'check') task.check(request)
      }
    }
  }
}
