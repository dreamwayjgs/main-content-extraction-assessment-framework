
import { LocalConfig } from "../../common"
import { GET, POST_Form } from "../../common/api"
import { requestContentScript } from "../chromePromise"
import { Crawler } from "./Crawler"
import { pageCapture } from "./pageCapture"

const localConfig = LocalConfig.getInstance()

export const createCrawlTask = async (sourceName: string) => {
  console.log("START Crawl", sourceName)
  const targets = await GET(localConfig.host, `crawl/source/${sourceName}`) as {
    size: number,
    pages: any[]
  }

  // const crawlRequest = {
  //   greet: 'hello'
  // }
  // EXAMPLE START
  const requestCallback = async (tabId: number, pid: string) => {
    return await requestContentScript(tabId, {
      taskName: 'crawl',
      order: 'im custom',
      id: pid,
    })
  }
  const responseCallback = async (task: Crawler, response: any) => {
    const { status, localDataPath, error } = response

    console.log("Crawl status", status, localDataPath, error)

    if (status !== 'ok') {
      throw Error(error);
    }
    const { rawHtml, elements } = await (await fetch(localDataPath)).json()
    const data: any = {
      id: task.cursor.id,
      url: task.cursor.url,
      rawHtml: rawHtml,
      elements: JSON.stringify(elements),
      isCompleted: task.loadTimedOut,
      mhtml: await pageCapture(task.tabId)
    }
    await POST_Form(LocalConfig.getInstance().host, 'crawl', data);
  }
  // EXAMPLE END
  const crawler = await Crawler.create(targets.pages, requestCallback, responseCallback)
  await crawler.startOnNewTab()
}