import { LocalConfig } from "../../common"
import { getExtractionConfig } from "../../common/configs/extraction"
import { getSync } from "../../common/storage"
import { Page } from "../../types"
import { TaskManager } from "../../types/task"
import { GET, POST } from "../utils"
import { Extraction } from "./Extraction"

export async function createExtractionTask(sourceName: string) {
  console.log("START Extraction", sourceName)
  const host = await getSync('host')
  const target = await GET(host, `extraction/source/${sourceName}`) as {
    size: number,
    pages: Page[]
  }
  const manager = TaskManager.getInstance()
  const config = await getExtractionConfig()

  // EXAMPLE START: requesting Mozilla Readability.js
  // Using requestCallback as an object, the id and taskName are fixed.
  const requestCallback = {
    extractorName: 'mozilla'
  }
  // requestCallback as a function.
  // const requestCallback = async (tabId: number, pid: string) => {
  //   return await requestContentScript(tabId, {
  //     taskName: TASK_NAME_EXTRACTION,
  //     extractorName: 'mozilla',
  //     id: pid,
  //   })
  // }
  const responseCallback = async (task: Extraction, response: any) => {
    console.log("Extraction response", response, task)
    const { status, extractorName, data, error, pid } = response
    if (status === 'ok' && !task.config.watch) {
      await POST(LocalConfig.getInstance().host, `extraction/result/${extractorName
        }/${pid}`, data)
    } else if (status !== 'ok') {
      console.error("[EXTRACTION] Error from content script response pid:", pid, error)
    }
  }
  // EXAMPLE END
  const task = await manager.create<Extraction>(
    target.pages, Extraction, config, requestCallback, responseCallback)
  task.start()
}

chrome.contextMenus.create({
  id: 'ExtractionControl',
  title: `Extraction Control`,
})