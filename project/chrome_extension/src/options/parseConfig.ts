import { setStatus } from "./status"
import { load } from 'js-yaml'

export function parseConfig(textInputEl: HTMLTextAreaElement, parseResultEl: HTMLElement) {
  const text = textInputEl.value
  try {
    if (text.length === 0) {
      parseResultEl.innerText = 'Empty field'
    }
    const jsonValue: any = load(text)

    setStatus(new Promise<void>((resolve, reject) => {
      chrome.storage.sync.set({
        'configText': textInputEl.value,
        'configJson': JSON.stringify(jsonValue)
      }, () => {
        parseResultEl.textContent = JSON.stringify(jsonValue, undefined, 2)
        resolve()
      })
    }), {
      loading: 'Saving...',
      done: 'Saved!'
    })
  }
  catch (e) {
    if (e instanceof SyntaxError) {
      parseResultEl.innerText = 'No valid YAML string'
    }
  }
}