import { LocalConfig } from "../common"
import { TASK_NAME_CRAWL } from "../common/configs/crawl"
import { TASK_NAME_CURATION } from "../common/configs/curation"
import { TASK_NAME_EVALUATION } from "../common/configs/evaluation"
import { TASK_NAME_EXTRACTION } from "../common/configs/extraction"
import { createCrawlTask } from "./Crawl"
import { createCurationTask } from "./Curation"
import { createEvaluationTask } from "./Evaluation"
import { createExtractionTask } from "./Extraction"

LocalConfig.getInstance().init()

/**
 * Recieving Message from Options page to execute modules
 * @param request Task name: Crawl, Curation, Evaluation, Extraction
 * @param sourceName source name for the target task
 */
chrome.runtime.onMessage.addListener((message) => {
  const { request, sourceName } = message
  console.log("Recieved message:", message)
  if (request) {
    switch (request) {
      case TASK_NAME_CRAWL:
        createCrawlTask(sourceName)
        break
      case TASK_NAME_CURATION:
        createCurationTask(sourceName)
        break
      case TASK_NAME_EXTRACTION:
        createExtractionTask(sourceName)
        break
      case TASK_NAME_EVALUATION:
        createEvaluationTask(sourceName)
        break
      default:
        console.log("Unknown Request. Ignored", request)
    }
  }
})