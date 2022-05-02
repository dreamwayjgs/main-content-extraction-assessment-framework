import { getCurrentConfig, getDefaultConfig, TaskConfig } from "./common"
import has from 'has'

export const TASK_NAME_EXTRACTION = 'extraction'


type ExpansionMethod = "ArticleTag" | "AttrSemantic" | "SizeDiff"

export interface ExtractionConfig extends TaskConfig {
  gridColumn: number
  gridRow: number
  gridCoef: number
  linkRatio: number
  expand: ExpansionMethod[]
  name: string
  resolution: number
  reversed: boolean
  widthIncrease: number
}

export async function getExtractionConfig(): Promise<ExtractionConfig> {
  const currentConfig = await getCurrentConfig()
  const config: any = has(currentConfig, TASK_NAME_EXTRACTION) ? currentConfig[TASK_NAME_EXTRACTION] : getDefaultConfig()

  const defaultConfig: ExtractionConfig = {
    start: config?.start || 0,
    end: config?.end || -1,
    watch: config?.watch || false,
    auto: config?.auto || false,
    taskName: "Extraction",
    name: config?.name || 'hyucentroid',
    gridRow: config?.gridRow || 4,
    gridColumn: config?.gridColumn || 6,
    gridCoef: config?.gridCoef || 2,
    linkRatio: config?.linkRatio || 0.5,
    expand: config?.expand || ["ArticleTag", "AttrSemantic", "SizeDiff"],
    resolution: config?.resolution || 1920,
    reversed: config?.reversed || false,
    widthIncrease: config?.widthIncrease || 1.3
  }

  if (defaultConfig.name.startsWith('hyucentroid')) {
    const expandTag = defaultConfig.expand.length === 3 ? 'A' : defaultConfig.expand.map(e => e.slice(0, 2)).join(',')
    defaultConfig.name = `${defaultConfig.name}-${defaultConfig.gridRow}-${defaultConfig.gridColumn}-${defaultConfig.linkRatio}-${defaultConfig.gridCoef}-${expandTag}`
    defaultConfig.name += defaultConfig.widthIncrease === 1.3 ? '' : `-w${defaultConfig.widthIncrease}`
    defaultConfig.name += defaultConfig.reversed ? '-R' : ''
    defaultConfig.name += `-${defaultConfig.resolution}`
  }
  return defaultConfig
}