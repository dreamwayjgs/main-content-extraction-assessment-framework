import { getCurrentConfig, getDefaultConfig, TaskConfig } from "./common"
import has from 'has'

export const TASK_NAME_EVALUATION = 'evaluation'

export interface EvaluationConfig extends TaskConfig {
  name: string
  openOrigin: boolean
  query?: { [key: string]: string }
}

export async function getEvaluationConfig(): Promise<EvaluationConfig> {
  const currentConfig = await getCurrentConfig()
  const config: any = has(currentConfig, TASK_NAME_EVALUATION) ? currentConfig[TASK_NAME_EVALUATION] : getDefaultConfig()

  const defaultConfig: EvaluationConfig = {
    start: config?.start || 0,
    end: config?.end || -1,
    watch: config?.watch || false,
    auto: config?.auto || false,
    taskName: "Evaluation",
    name: config?.name || 'hyucentroid',
    openOrigin: config?.openOrigin || false,
    query: config?.query || {}
  }
  return defaultConfig
}
