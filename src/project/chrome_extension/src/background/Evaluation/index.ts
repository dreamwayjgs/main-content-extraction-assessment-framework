import { LocalConfig } from '../../common'
import { getEvaluationConfig, TASK_NAME_EVALUATION } from '../../common/configs/evaluation'
import { getSync } from "../../common/storage"
import { Page } from "../../types"
import { TaskManager } from "../../types/task"
import { requestContentScript } from "../chromePromise"
import { GET, POST } from "../utils"
import { Evaluation } from './Evaluation'

export async function createEvaluationTask(sourceName: string) {
  console.log("START evaluation", sourceName)
  const host = await getSync('host')
  const target = await GET(host, `evaluation/source/${sourceName}`) as {
    size: number,
    pages: Page[]
  }
  const manager = TaskManager.getInstance()
  const config = await getEvaluationConfig()

  // EXAMPLE START: requesting Mozilla Readability.js
  const requestCallback = async (tabId: number, pid: string) => {
    const extractorName = 'mozilla'
    const { results } = await GET(LocalConfig.getInstance().host, `evaluation/extraction/${task.currentPage.id}`)
    const { answers } = await GET(LocalConfig.getInstance().host, `evaluation/answer/${task.currentPage.id}`)

    console.log("requesting evaluation to content script", extractorName, pid, results, answers)

    return await requestContentScript(tabId, {
      taskName: TASK_NAME_EVALUATION,
      extractorName,
      results,
      answers,
      id: pid,
    })
  }
  const responseCallback = async (task: Evaluation, response: any) => {
    console.log("Evaluation response", response, task)
    const { status, data, error, id: pid } = response
    if (status === 'ok' && !task.config.watch) {
      await POST(LocalConfig.getInstance().host, `evaluation/metrics/${pid}`, data)
    }
  }
  // EXAMPLE END
  const task = await manager.create<Evaluation>(target.pages, Evaluation, config, requestCallback, responseCallback)
  task.start()
}

chrome.contextMenus.create({
  id: 'EvaluationControl',
  title: `Evaluation Control`,
})