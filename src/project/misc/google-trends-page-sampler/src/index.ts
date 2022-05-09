import { config } from "dotenv"
import { crawlBaiduSeeds, parseBaiduSeed } from "./baidu"
config()

async function main() {
  // console.log(process.env.HOST)
  // if (!!!process.env.HOST) throw new Error("No HOST")
  // const HOST = process.env.HOST
  // let jobsDone = 0
  // for (let i = 0; i < 20; i++) {
  //   const done = await parseBaiduSeed(i, HOST)
  //   console.log(done)
  //   jobsDone += done
  // }
  // console.log(jobsDone)
  // console.log(process.env.SerpApiKey)
  // if (!!!process.env.SerpApiKey) throw new Error("No API KEY")
  // const apiKey = process.env.SerpApiKey
  // crawlBaiduSeeds(apiKey)
}


if (typeof require !== 'undefined' && require.main === module) {
  main()
}