export const TASK_NAME = "Unknown task"

export interface TaskConfig {
  start: number
  end: number
  watch: boolean
  auto: boolean
  taskName: string
}

export function getDefaultConfig(config?: Partial<TaskConfig>): TaskConfig {
  const defaultConfig: TaskConfig = {
    start: config?.start || 0,
    end: config?.end || -1,
    watch: config?.watch || false,
    auto: config?.auto || false,
    taskName: TASK_NAME,
  }
  return defaultConfig
}

export async function getCurrentConfig() {
  return new Promise<any>((resolve, reject) => {
    chrome.storage.sync.get('configJson', items => {
      if (items.configJson !== undefined) {
        resolve(JSON.parse(items.configJson))
      }
    })
  })
}