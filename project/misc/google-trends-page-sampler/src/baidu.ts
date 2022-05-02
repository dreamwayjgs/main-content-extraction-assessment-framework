import { readFileSync, writeFileSync } from "fs";
import fetch from "node-fetch";


export async function crawlBaiduSeeds(apiKey: string) {
  const keywords = readKeywords()

  const queries = keywords.map(keyword => {
    const api = new URL('https://serpapi.com/search')
    api.searchParams.append('engine', 'baidu')
    api.searchParams.append('api_key', apiKey)
    api.searchParams.append('rn', '50')
    api.searchParams.append('pn', '2')
    const query = keyword
    api.searchParams.append('q', query)
    return api
  })

  queries.forEach(async (url, index) => {
    const result = await (await fetch(url.toString())).json()
    writeFileSync(`baidu-2020-${index}-2.json`, JSON.stringify(result))
  })
}

function run() {
  console.log(process.env.SerpApiKey)
  if (!!!process.env.SerpApiKey) throw new Error("No API KEY")
  const apiKey = process.env.SerpApiKey
  crawlBaiduSeeds(process.env.SerpApiKey)
}

interface BaiduSearchResult {
  search_metadata: any
  search_parameters: { q: string }
  organic_results: BaiduSearchItem[]
}

interface BaiduSearchItem {
  position: number
  title: string
  link: string
  date: string
  displayed_brand: string
  snippet: string
  cached_page_link: string
}

/*
  url                 String
  source              String  
  savedDate           DateTime?
  description         Json?
  sample              Boolean?
*/

export async function parseBaiduSeed(filename: string | number, host: string) {
  const filepath = typeof (filename) === 'string' ? filename : `baidu-2020-${filename}-2.json`
  console.log(filepath)
  const data: BaiduSearchResult = JSON.parse(readFileSync(filepath).toString())
  const keyword = data.search_parameters.q
  console.log(keyword, data.organic_results.length)
  const url = `${host}/crawl/source`
  const body = data.organic_results.filter(item => item.link).map(item => {
    return {
      url: item.link,
      source: 'baidu-2020',
      description: {
        keyword: keyword,
        ...item
      }
    }
  })

  const response = await (await fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })).json()
  return body.length
}

function readKeywords(filepath = 'baidu.txt') {
  const keywords = readFileSync(filepath).toString().split('\n')
  return keywords
}