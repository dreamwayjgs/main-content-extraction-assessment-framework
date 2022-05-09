import { getCurrentConfig, getDefaultConfig, TaskConfig } from "./common";
import has from 'has'

export const TASK_NAME_CRAWL = 'crawl'

export interface CrawlConfig extends TaskConfig {
  timeoutAfterLoad: number
  timeoutAfterOpen: number
}

export async function getCrawlConfig(): Promise<CrawlConfig> {
  const currentConfig = await getCurrentConfig()
  const config: any = has(currentConfig, TASK_NAME_CRAWL) ? currentConfig[TASK_NAME_CRAWL] : getDefaultConfig()

  return {
    timeoutAfterLoad: config?.timeoutAfterLoad || 5000,
    timeoutAfterOpen: config?.timeoutAfterOpen || 5000,
    ...config
  }
}