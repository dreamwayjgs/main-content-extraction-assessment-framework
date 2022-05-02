import { readFileSync } from "fs"
import { flatten, result } from "lodash"
import fetch from "node-fetch"
import { HOST, ResultGoogleTrendsSingleYear, ResultKeywordSet, ResultSearchResult, ResultSingleKeyword } from "./google"

interface CrawlTargetPage {
  url: string
  source: string
  description: {
    category: string,
    keyword: string,
    googleTrendsBaseId: string,
    googleTrendsKeywordSetId: string,
    title: string,
    snippet?: string
  }
}

const convertSearchResultToPage = (result: ResultSingleKeyword, values: any): CrawlTargetPage[] => {
  const { source, googleTrendsBaseId, googleTrendsKeywordSetId, category } = values
  const keyword = result.keyword
  return result.webpages.map(v => ({
    url: v.url,
    source: source,
    description: {
      category: category,
      keyword: keyword,
      googleTrendsBaseId: googleTrendsBaseId,
      googleTrendsKeywordSetId: googleTrendsKeywordSetId,
      title: v.title,
      snippet: v.snippet
    }
  }))
}

const convertKeywordSetToPage = (keywordSet: ResultKeywordSet, values: any): CrawlTargetPage[] => {
  const { source, googleTrendsBaseId } = values
  const category = keywordSet.category
  const googleTrendsKeywordSetId = keywordSet.googleTrendsKeywordSetId
  const results = keywordSet.resultsOfKeywords.map(v => convertSearchResultToPage(v, {
    source: source,
    googleTrendsBaseId: googleTrendsBaseId,
    googleTrendsKeywordSetId: googleTrendsKeywordSetId,
    category: category
  }))
  return flatten(results)
}

const convert = (file: ResultGoogleTrendsSingleYear, region: string): CrawlTargetPage[] => {
  const { year } = file
  const source = `GoogleTrends-${year}-${region}`
  const googleTrendsBaseId = file.googleTrendsBaseId
  console.log("keywords", file.resultsOfKeywordSets.map(v => v.category))
  const results = file.resultsOfKeywordSets.map(v => convertKeywordSetToPage(v, {
    source: source,
    googleTrendsBaseId: googleTrendsBaseId
  }))
  return flatten(results)
}

async function convertAndCommit() {
  // const years = [2017, 2018, 2019, 2020]
  const years = [2020]
  // const regions = ['KR', 'JP', 'ID']
  const regions = ['FR', 'RU', 'SA']
  for (const year of years) {
    for (const region of regions) {
      const filepath = `data-${year}-${region}.json`
      const file: ResultGoogleTrendsSingleYear = JSON.parse(readFileSync(filepath).toString())
      console.log(Object.keys(file))
      console.log("결과 설명")
      console.log("결과 날짜", file.year, file.region)
      console.log("레퍼런스", file.googleTrendsBaseId)

      const results = convert(file, region)
      console.log("TODO", results.length)
      fetch(`${HOST}/crawl/source`, {
        method: 'post',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(results)
      }).then(res => {
        return res.json()
      }).then(v => console.log(v))
    }
  }
}
if (typeof require !== 'undefined' && require.main === module) {
  convertAndCommit()
}
