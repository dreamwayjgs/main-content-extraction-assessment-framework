import autoBind from "auto-bind";
import { filter, find, findIndex, uniq } from "lodash";
import { tabs } from "../background/chromePromise";
import { getRandomInt } from "../common";
import { TaskConfig, getDefaultConfig } from "../common/configs/common";
import { Page } from "./models";

export class Task {
  protected pageGenerator: Generator<Page, void, unknown>
  public currentPage: Page
  public status: 'running' | 'paused' | 'finished' | 'pending' = 'pending'
  public finishEvent: CustomEvent
  constructor(
    public tabId: number,
    public pages: Page[],
    public config: TaskConfig = getDefaultConfig(),
    public requestCallback?: any,
    public responseCallback?: (task: any, message: any, sendResponse: (response: any) => void) => Promise<void>
  ) {
    this.pageGenerator = this.generate()
    const start = this.pageGenerator.next()
    if (!start.done) {
      this.currentPage = start.value
      this.status = 'running'
      this.finishEvent = new CustomEvent('taskFinished', {
        detail: {
          tabId: tabId
        }
      })
    }
    else throw Error("Page length is 0")
    autoBind(this)
  }
  *generate(): Generator<Page, void, unknown> {
    let index = 0
    while (true) {
      if (index >= this.pages.length) break;
      console.info(`Progress: ${index} / ${this.pages.length}`)
      const prev = yield this.pages[index]
      if (prev === 'prev') index = Math.max(index - 1, 0);
      else if (typeof (prev) === 'number') index = Math.min(this.pages.length, prev)
      else index++;
      const auto = this.config.auto
      if (!auto && typeof (prev) !== 'number')
        chrome.storage.sync.set({ 'cursor': index.toString() });
    }
    console.info("Jobs done.", this.tabId)
    this.status = 'finished'
    window.dispatchEvent(this.finishEvent)
    setTimeout(() => {
      chrome.tabs.remove(this.tabId)
    }, 1000 + getRandomInt(2000))
  }
  attachControls() {
    const clsName = this.constructor.name
    chrome.contextMenus.create({
      id: `${clsName}Prev-${this.tabId}`,
      title: `Prev ${this.tabId}`,
      parentId: `${clsName}Control`,
      onclick: this.prev
    })
    chrome.contextMenus.create({
      id: `${clsName}Next-${this.tabId}`,
      title: `Next ${this.tabId}`,
      parentId: `${clsName}Control`,
      onclick: this.next
    })
    chrome.contextMenus.create({
      id: `${clsName}Move-${this.tabId}`,
      title: `Move ${this.tabId}`,
      parentId: `${clsName}Control`,
      onclick: () => {
        chrome.storage.sync.get('cursor', items => {
          if (items.cursor && !!parseInt(items.cursor)) this.move(parseInt(items.cursor));
        })
      }
    })
  }
  start() { }
  load() { }
  move(id: number) {
    const cursor = this.pageGenerator.next(id)
    if (!cursor.done) {
      this.currentPage = cursor.value
      this.load()
    }
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
      this.status = 'finished'
      TaskManager.getInstance().destroy(this.tabId)
    } else {
      this.currentPage = next.value
      this.load()
    }
  }
  goto(pid: string) {
    this.pageGenerator = this.generate()
    for (let i = 0; i < this.pages.length; i++) {
      const cursor = this.pageGenerator.next(i)
      if (!cursor.done) {
        if (cursor.value.id === pid) {
          chrome.storage.sync.set({ 'cursor': i.toString() })
          return cursor.value
        }
      }
    }
    return this.currentPage
  }

  attachEvents() { }
  checkEvents() { }
  detachEvents() { }
  static getClassName() {
    return this.name
  }
}

interface TaskStatus {
  task: Task
  taskType: string
}

interface TaskQueue {
  config: TaskConfig
  status: 'running' | 'pending' | 'finished'
  TaskClass: Task
  requestCallback: (tabId: number, pid: string) => Promise<any> | { [key: string]: any }
  responseCallback: (task: Task, response: any) => void
  pages: Page[]
}

export class TaskManager {
  protected tasks: TaskStatus[] = []
  public thread = 4
  public queue: TaskQueue[] = []
  protected static manager: TaskManager
  protected constructor() {
    chrome.contextMenus.create({
      id: 'TaskManager',
      title: 'Show Tasks in Background console',
      onclick: () => {
        console.log(this.getRunningTasks())
      }
    })
    window.addEventListener("taskFinished", ((e: CustomEvent) => {
      const task = this.dequeue()
      if (task === null) console.log("ALL TASK DONE", Date.now());
    }) as EventListener)
  }
  static getInstance(): TaskManager {
    if (!TaskManager.manager) {
      TaskManager.manager = new TaskManager()
    }
    return TaskManager.manager
  }
  enqueue(pages: Page[], TaskClass: any, taskConfig: TaskConfig, requestCallback: (tabId: number, pid: string) => Promise<any> | { [key: string]: any }, responseCallback: (task: Task, response: any) => void) {
    const status: 'pending' = 'pending'
    const queue = {
      config: taskConfig,
      status,
      pages,
      requestCallback,
      responseCallback,
      TaskClass
    }
    this.queue.push(queue)
    return queue
  }
  async dequeue<T extends Task>(): Promise<T | null> {
    const target = findIndex(this.queue, task => task.status === 'pending')
    const pending = this.queue[target]
    if (pending) {
      pending.status = 'running'
      const { pages, TaskClass, config, requestCallback, responseCallback } = pending
      const task = await this.create<T>(pages, TaskClass, config, requestCallback, responseCallback)
      task.start()
      return task
    }
    return null
  }
  async runQueue() {
    console.warn("Thread", this.thread)
    for (let i = 0; i < this.queue.length; i++) {
      if (i < this.thread) await this.dequeue()
    }
  }
  async create<T extends Task>(pages: Page[], TaskClass: any, taskConfig: TaskConfig, requestCallback: any, responseCallback: any): Promise<T> {
    const tab = await tabs.create()
    if (tab.id === undefined) throw new Error("Cannot Create Valid Tab")
    const task = new TaskClass(tab.id, pages, taskConfig, requestCallback, responseCallback)
    task.config = taskConfig
    console.info(`Running Task ${TaskClass.name} in ${tab.id}`, task)
    task.attachEvents()
    if (this.tasks.length === 0) this.open();
    this.tasks.push({
      task: task,
      taskType: task.constructor.name
    })
    return task
  }
  destroy(tabId: number) {
    const index = this.findTaskIndexWith(tabId)
    if (index === -1) return;
    const currentTasksTypes = uniq(this.tasks.map(o => o.taskType))
    const target = this.tasks[index]

    console.info(`Closing ${target.taskType} on ${target.task.tabId}`)

    this.tasks.splice(index, 1)
    const tasksTypes = uniq(this.tasks.map(o => o.taskType))
    if (currentTasksTypes.length !== tasksTypes.length) {
      console.info(`Task ${target.taskType} done. Detaching events`)
      target.task.detachEvents()
    }
    if (this.tasks.length === 0) {
      this.close()
    }
    // setInterval(() => chrome.tabs.remove(target.task.tabId), 10000)
  }
  getRunningTasks() {
    return this.tasks
  }
  get taskTypes() {
    return uniq(this.tasks.map(o => o.taskType))
  }
  getTaskByTabId<T extends Task>(tabId: number) {
    const taskStatus = find(this.tasks, o => o.task.tabId === tabId)
    if (taskStatus === undefined) throw new Error(`Task Not Found in ${tabId}`)
    return taskStatus as { task: T, taskType: string }
  }
  getTasksByType<T extends Task>(taskType: string) {
    return filter(this.tasks, o => o.taskType === taskType).map(o => o.task) as T[]
  }
  checkRemoval = (tabId: number, removeInfo: chrome.tabs.TabRemoveInfo) => {
    TaskManager.getInstance().destroy(tabId)
  }
  findTaskIndexWith(tabId: number) {
    const index = findIndex(this.tasks, o => o.task.tabId === tabId)
    return index
  }
  open() {
    console.log("Open task manager")
    chrome.tabs.onRemoved.addListener(this.checkRemoval)
  }
  check() { }
  close() {
    console.info("End of all tasks", new Date())
    chrome.tabs.onRemoved.removeListener(this.checkRemoval)
  }
}