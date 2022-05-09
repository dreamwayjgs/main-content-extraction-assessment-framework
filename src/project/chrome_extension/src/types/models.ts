import { EvaluationConfig } from "../common/configs/evaluation"

export interface Page {
  id: string
  url: string
  source: string
  listedDate: Date
  savedDate?: Date | null,
  description: {
    category: string,
    keyword: string,
    googleTrendsBaseId: string,
    googleTrendsKeywordSetId: string,
    title: string,
    snippet?: string
  },
  sample?: boolean
}

export interface Answer {
  hyuIndex: string
  id: string
  pid: string
  tagType: "maincontent" | "title" | "nav" | "loginForm"
  userId: string
}

export interface ExtractionResult {
  desc?: any
  best?: boolean
  isReadable?: boolean
  hyuIndex?: number | string
  name: string
  tagType: string
  userId: string
  content: string | string[] | number[]
}

export interface EvaluationRequest {
  work: string
  action: string
  answers: Answer[]
  originalUrl: string
  target: string
  results: ExtractionResult[]
  config: EvaluationConfig
  pid: string
}

export interface Source {
  source: string
  size: number
}