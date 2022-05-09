function handleElementSelection(elemId: string, name?: string) {
  const groupName = name ? name : elemId

  const button = document.getElementById(elemId)
  if (button !== null) {
    button.onclick = () => {
      chrome.devtools.inspectedWindow.eval("console.log($0)")
      chrome.devtools.inspectedWindow.eval(`_injected.getElement($0, '${groupName}')`, { useContentScriptContext: true }, (result, info) => {
        console.log(result)
        console.info(info)
      })
    }
  }
}

handleElementSelection('maincontent')
handleElementSelection('nav')
handleElementSelection('loginForm')
handleElementSelection('title')


function panelMain() {
  const goToOptions = document.getElementById('goToOptions')!
  const userIdSpan = document.getElementById('userId')!
  const getUserId = document.getElementById("getUserId")!

  goToOptions.onclick = () => {
    chrome.runtime.openOptionsPage()
  }
  const checkUserId = () => {
    chrome.storage.sync.get('userId', items => {
      if (userIdSpan.textContent !== undefined)
        userIdSpan.textContent = items.userId;
    })
  }
  getUserId.onclick = checkUserId
  window.onload = checkUserId
}

panelMain()