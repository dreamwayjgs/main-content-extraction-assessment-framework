import fetch from 'node-fetch'
import { GOOGLE_API_KEY, GOOGLE_CX } from './google'
import { GoogleSearchResponse, Result } from './googleInterfaces'
import dayjs from 'dayjs'


export async function search(q: string, start = 1, date = [new Date(0), new Date()]) {
  const url = new URL('https://www.googleapis.com/customsearch/v1')
  const params = url.searchParams
  params.append('key', GOOGLE_API_KEY)
  params.append('cx', GOOGLE_CX)
  params.append('q', q)
  params.append('start', start.toString())
  params.append('sort', `date:r:${dayjs(date[0]).format("YYYYMMDD")}:${dayjs(date[1]).format("YYYYMMDD")}`)

  console.log("SEARCH", url.toString())
  try {
    const result: GoogleSearchResponse = await (await fetch(url.toString())).json()
    // console.log("SEARCHED", result.queries.request)
    return result
  }
  catch (err) {
    throw new Error(err)
  }
}

export async function searchUpToMaxCount(q: string, maxCount = 10, date = [new Date(0), new Date()]) {
  let count = 0
  let start = 1
  const results: Result[] = []
  while (true) {
    const result = await search(q, start, date)

    if (result.items === undefined) {
      console.log("SEARCH DONE of No Result", count, start)
      break
    }
    if (result.queries.nextPage !== undefined) {
      start = result.queries.nextPage[0].startIndex
    }
    else {
      console.log("SEARCH DONE of start ends", count, start)
      break
    }

    results.push(...result.items)
    count += result.queries.request[0].count

    if (count >= maxCount) {
      console.log("SEARCH DONE of counts", count, start)
      break
    }
  }
  return results
}