import { getSync, setSync } from "../common/storage"
import { parseConfig } from "./parseConfig"
import { checkApiServer } from "./connection"
import { loadSources } from "./sources"
import { setStatus } from "./status"

function inputControl() {
  const userIdInput = document.getElementById('userId')! as HTMLInputElement
  const hostInput = document.getElementById('host')! as HTMLInputElement
  const mhtmlApiInput = document.getElementById('mhtml-api')! as HTMLInputElement
  const resetHostButton = document.getElementById('setDefaultHost')! as HTMLButtonElement
  const cursorInput = document.getElementById('cursor')! as HTMLInputElement
  const configTextInput = document.getElementById('config-text') as HTMLTextAreaElement
  const apiConnectionText = document.getElementById('api-status') as HTMLSpanElement
  const mhtmlConnectionText = document.getElementById('mhtml-status') as HTMLSpanElement
  const configParseResult = document.getElementById('json-validity') as HTMLDivElement

  resetHostButton.onclick = () => {
    hostInput.value = 'http://127.0.0.1:59000'
    setSync({
      'host': hostInput.value
    })

    mhtmlApiInput.value = 'http://127.0.0.1:59010'
    setSync({
      'mhtmlApi': mhtmlApiInput.value
    })
  }

  getSync('host').then(value => {
    hostInput.value = value
    apiConnectionText.innerText = 'Connecting...'
    checkApiServer(hostInput.value).then((result) => {
      console.log("API Server Connection Result:", result)
      if (result) apiConnectionText.innerText = 'Connected!'
    })
  })

  getSync('mhtmlApi').then(value => {
    mhtmlApiInput.value = value
    mhtmlConnectionText.innerText = 'Connecting...'
    checkApiServer(mhtmlApiInput.value).then((result) => {
      console.log("MHTML Server Connection Result:", result)
      if (result) mhtmlConnectionText.innerText = 'Connected!'
    })
  })

  getSync('userId').then(value => {
    userIdInput.value = value
  })

  getSync('cursor').then(value => {
    cursorInput.value = value
  })

  getSync('configText').then(value => {
    configTextInput.value = value
    parseConfig(configTextInput, configParseResult)
  })

  hostInput.onkeyup = () => {
    setStatus(new Promise<void>((resolve, reject) => {
      chrome.storage.sync.set({
        'host': hostInput.value
      }, () => {
        apiConnectionText.innerText = 'Connecting...'
        checkApiServer(hostInput.value).then((result) => {
          if (result) apiConnectionText.innerText = 'Connected!'
        })
        resolve()
      })
    }), {
      loading: 'Saving...',
      done: 'Saved!'
    })
  }

  mhtmlApiInput.onkeyup = () => {
    setStatus(new Promise<void>((resolve, reject) => {
      chrome.storage.sync.set({
        'mhtmlApi': mhtmlApiInput.value
      }, () => {
        mhtmlConnectionText.innerText = 'Connecting...'
        checkApiServer(mhtmlApiInput.value).then((result) => {
          console.log("MHTML Server Connection Result:", result)
          if (result) mhtmlConnectionText.innerText = 'Connected!'
        })
        resolve()
      })
    }), {
      loading: 'Saving...',
      done: 'Saved!'
    })
  }

  userIdInput.onkeyup = () => {
    setStatus(new Promise<void>((resolve, reject) => {
      chrome.storage.sync.set({
        'userId': userIdInput.value
      }, () => { resolve() })
    }), {
      loading: 'Saving...',
      done: 'Saved!'
    })
  }

  cursorInput.onkeyup = () => {
    setStatus(new Promise<void>((resolve, reject) => {
      chrome.storage.sync.set({
        'cursor': cursorInput.value
      }, () => { resolve() })
    }), {
      loading: 'Saving...',
      done: 'Saved!'
    })
  }

  configTextInput.onkeyup = () => {
    parseConfig(configTextInput, configParseResult)
  }
}


async function main() {
  inputControl()

  const resetSourceButton = document.getElementById('load-source')! as HTMLButtonElement
  resetSourceButton.onclick = () => { loadSources() }
  loadSources()

}

window.onload = () => {
  main()
}