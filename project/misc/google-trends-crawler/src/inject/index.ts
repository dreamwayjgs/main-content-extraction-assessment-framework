const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function clickShowMoreAll() {
  const showmores = document.querySelectorAll('.show-more')
  for (const [index, button] of Object.entries(showmores)) {
    (button as HTMLElement).click()
  }
  wait(200)
}

function getKeywordsInACategory(wrapper: HTMLElement) {
  const category = wrapper.querySelector('.expandable-list-header-text')
  const keywords = wrapper.querySelectorAll('.fe-expandable-item-text')
  return {
    category: category?.textContent?.trim(),
    keywords: Array.from(keywords).map(keyword => keyword.textContent?.trim())
  }
}

function getKeywords() {
  clickShowMoreAll()
  const wrappers = document.getElementsByClassName('widget-template')
  const data = Array.from(wrappers).map(wrapper => getKeywordsInACategory(wrapper as HTMLElement))
  return data
}


async function main() {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    const data = getKeywords()
    setTimeout(() => {
      sendResponse(data)
    }, 2000)
    return true // Background wait response. It means 'there is a response.'
  })
}

main()