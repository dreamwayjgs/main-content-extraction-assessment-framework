import { isProbablyReaderable, Readability } from '@mozilla/readability'
import { TASK_NAME_EXTRACTION } from "../../common/configs/extraction"


export function initExtraction() {
  console.log("[INIT] Extraction Ready")
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const { taskName } = message
    if (taskName === TASK_NAME_EXTRACTION) {
      // TODO: Extracting in content script context
      // EXAMPLE START: mozilla
      const { extractorName, id } = message
      if (extractorName === 'mozilla') {
        const isReadable = isProbablyReaderable(document)
        const documentClone = document.cloneNode(true);
        const article = new Readability(documentClone as Document).parse()
        const answerIndex = article && article.content ? getAnswerIndex(article.content) : null
        const result = {
          isReadable: isReadable,
          article: article,
          answerIndex: answerIndex
        }
        sendResponse({
          status: 'ok',
          extractorName,
          data: JSON.stringify(result),
          pid: id
        })
        return true
      }
      // EXAMPLE END

      // Send Extraction Result
      // sendResponse({ status: 'ok' })
      // return true
    }
  })
}

function getAnswerIndex(contentString: string) {
  const content = createElementFromHTML(contentString).firstElementChild! as HTMLElement
  const answerIndex = content.getAttribute('hyu')
  return answerIndex
}

function createElementFromHTML(htmlString: string): HTMLElement {
  const div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstElementChild as HTMLElement
}