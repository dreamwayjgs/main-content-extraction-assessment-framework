import has from 'has'
import { getCurrentConfig, getDefaultConfig, TaskConfig } from "./common";

export const TASK_NAME_CURATION = 'curation'

export interface CurationConfig extends TaskConfig {

}

export async function getCurationConfig(): Promise<CurationConfig> {
  const currentConfig = await getCurrentConfig()
  const config: any = has(currentConfig, TASK_NAME_CURATION) ? currentConfig[TASK_NAME_CURATION] : getDefaultConfig()

  return config
}