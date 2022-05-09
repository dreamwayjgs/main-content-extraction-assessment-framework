import { TASK_NAME_EVALUATION } from "../../common/configs/evaluation"

export function initKeyBrowse() {
  window.onload = () => {
    document.onkeyup = (ev: KeyboardEvent) => {
      if (ev.altKey && ev.key === 'v') {
        // NEXT
        chrome.runtime.sendMessage({
          work: 'common',
          action: 'next'
        })
      }
      if (ev.altKey && ev.key === 'c') {
        // PREV
        chrome.runtime.sendMessage({
          work: 'common',
          action: 'prev'
        })
      }
      if (ev.altKey && ev.key === 'b') {
        // PREV
        chrome.runtime.sendMessage({
          work: 'common',
          action: 'nav'
        })
      }
      if (ev.altKey && ev.key === 'k') {
        // CHECK
        chrome.runtime.sendMessage({
          work: TASK_NAME_EVALUATION,
          action: 'check',
          request: {
            name: 'speedreader',
            isReaderable: true,
            isWorkWell: true,
            content: document.body.firstElementChild
          }
        })
      }
      if (ev.altKey && ev.key === 'n') {
        // CHECK
        chrome.runtime.sendMessage({
          work: TASK_NAME_EVALUATION,
          action: 'check',
          request: {
            name: 'speedreader',
            isReaderable: true,
            isWorkWell: false,
            content: document.body.firstElementChild
          }
        })
      }
      // if (ev.altKey && ev.key === 'x') {
      //   toggleGrids()
      // }
      if (ev.altKey && ev.key === 'a') {
        chrome.runtime.sendMessage({
          work: 'curation',
          action: 'checkNoMedia'
        })
      }
      if (ev.altKey && ev.key === 'm') {
        chrome.runtime.sendMessage({
          work: 'curation',
          action: 'checkMedia'
        })
      }
    }
  }
}


