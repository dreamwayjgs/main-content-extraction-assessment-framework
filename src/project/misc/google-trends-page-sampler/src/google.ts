import { searchUpToMaxCount } from "./googleSearch"
import { config } from 'dotenv'
import fetch from "node-fetch"
import { readFileSync, writeFile, writeFileSync } from "fs"


config()
export const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || ''
export const GOOGLE_CX = process.env.GOOGLE_CUSTOM_SEARCH_CX || ''
export const HOST = process.env.HOST || ''
const YEAR = new Date().getFullYear()

interface GoogleTrendsKeywordSet {
  id: string
  category: string
  keywords: string[]
}

interface GoogleTrendsBase {
  id: string
  year: number
  region: string
  url: string
  keywordSet: GoogleTrendsKeywordSet[]
}

export interface ResultSearchResult {
  url: string,
  title: string,
  snippet?: string
}

export interface ResultSingleKeyword {
  keyword: string,
  webpages: ResultSearchResult[]
}

export interface ResultKeywordSet {
  googleTrendsKeywordSetId: string
  category: string
  resultsOfKeywords: ResultSingleKeyword[]
}

export interface ResultGoogleTrendsSingleYear {
  resultsOfKeywordSets: ResultKeywordSet[],
  year: number
  region: string
  googleTrendsBaseId: string
}

async function crawlWithAKeyword(keyword: string, endDate = new Date()): Promise<ResultSingleKeyword> {
  const searchResult = await searchUpToMaxCount(keyword, 10, [new Date(0), endDate])
  return {
    keyword: keyword,
    webpages: searchResult.map(v => ({
      url: v.link,
      title: v.title,
      snippet: v.snippet
    }))
  }
}

async function crawlSingleKeywordSet(keywordSet: GoogleTrendsKeywordSet, year = YEAR): Promise<ResultKeywordSet> {
  const { id, category, keywords } = keywordSet
  const endDate = new Date(new Date(year, 12, 1).getTime() - 1)
  const resultsEachKeyword: ResultSingleKeyword[] = []
  for (const keyword of keywords) {
    console.log("KEYWORD", keyword)
    const resultSingleKeyword = await crawlWithAKeyword(keyword, endDate)
    resultsEachKeyword.push(resultSingleKeyword)
    console.log("WEBPAGES OF ", keyword, resultSingleKeyword.webpages.length)
  }
  return {
    googleTrendsKeywordSetId: id,
    category: category,
    resultsOfKeywords: resultsEachKeyword
  }
}

async function crawlGoogleTrendsOneYear(base: GoogleTrendsBase): Promise<ResultGoogleTrendsSingleYear> {
  const resultsEachCategory: ResultKeywordSet[] = []
  for (const keywordeSet of base.keywordSet) {
    console.log("CATEGORY", keywordeSet.category)
    const resultSingleCategory = await crawlSingleKeywordSet(keywordeSet, base.year)
    resultsEachCategory.push(resultSingleCategory)
  }
  return {
    year: base.year,
    region: base.region,
    googleTrendsBaseId: base.id,
    resultsOfKeywordSets: resultsEachCategory
  }
}


interface GoogleTrendsSource {
  description?: string,
  url: string,
  source: string
}

async function crawlGoogleSeeds() {

  const url = new URL(`${HOST}/crawl/seed/google`)
  const targets = await (await fetch(url.toString())).json()
  const regions = ['FR', 'RU', 'SA']
  // const regions = ['KR', 'JP', 'ID']
  const filter = {
    year: [2020],
    region: regions
  }
  const base = targets.data.filter((g: any) => filter.year.includes(g.year) && filter.region.includes(g.region))

  for (const google of base) {
    console.log(google.year, google.region)
    const data = await crawlGoogleTrendsOneYear(google)
    console.log(data.year)
    console.log(data.googleTrendsBaseId)
    console.log(data.resultsOfKeywordSets[0])
    writeFileSync(`data-${google.year}-${google.region}.json`, JSON.stringify(data))
  }
}

async function parseResult() {
  const result = JSON.parse(readFileSync('data.json').toString())
  console.log(Object.keys(result))
  console.log("결과 설명")
  console.log("결과 날짜", result.year)
  console.log("레퍼런스", result.googleTrendsBaseId)
  console.log("카테고리 1번", result.resultsOfKeywordSets.length)
  console.log("각 카테고리 이름", result.resultsOfKeywordSets.map((v: any) => v.category))
  console.log("각 카테고리 1번 키워드", result.resultsOfKeywordSets.map((v: any) => v.resultsOfKeywords[0].keyword))
  console.log("각 카테고리 1번 결과", result.resultsOfKeywordSets.map((v: any) => ([v.resultsOfKeywords[0].webpages[0].url, v.resultsOfKeywords[0].webpages[0].title])))
}

// parseResult()

if (typeof require !== 'undefined' && require.main === module) {
  crawlGoogleSeeds()
}