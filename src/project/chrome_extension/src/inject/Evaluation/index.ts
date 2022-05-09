import { TASK_NAME_EVALUATION } from "../../common/configs/evaluation"
import { evaluate } from "./evaluation"

export function initEvaluation() {
  console.log("[INIT] Eval Ready")
  chrome.runtime.onMessage.addListener((message: any, sender, sendResponse) => {
    // const { work, action, answers, originalUrl, config, results: extracted, pid } = message
    const { taskName } = message
    if (taskName === TASK_NAME_EVALUATION) {
      // TODO: Evaluating in content script context
      // EXAMPLE START: mozilla
      const { results, answers, id } = message
      try {
        const evalResult = evaluate(results, answers)
        sendResponse({ status: 'ok', data: evalResult, id })
      }
      catch (err) {
        console.error("Error on Evaluation Request", err)
        sendResponse({ status: 'error', error: err, id })
      }
      return true
      // EXAMPLE END

      // Send Extraction Result. Return true if your response is asynchronous.
      // sendResponse({ status: 'ok' })
      // return true
    }
  })
}