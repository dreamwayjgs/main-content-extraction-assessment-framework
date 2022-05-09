import { maxBy } from 'lodash'
import { ExtractionConfig } from '../../../common/configs/extraction'
import { ARTICLE_BLOCK_ELEMENTS } from '../../../types'
import { getTextDensity } from './calc'

export * from './elementRelation'

export function getFirstVisibleParent(elem: HTMLElement): HTMLElement | null {
  const { width, height } = elem.getBoundingClientRect()
  const size = width * height
  if (size === 0) {
    const parent = elem.parentElement
    if (parent) return getFirstVisibleParent(parent);
    else return null;
  }
  return elem
}


export function countDescentants(root?: HTMLElement) {
  const largestDescentants = {
    count: 0,
    elem: document.body
  }
  document.querySelectorAll(":not(.hyu)").forEach(node => {
    const descentantsCount = node.querySelectorAll("*").length
    if (descentantsCount > 0) {
      node.setAttribute('hyuDescentdants', descentantsCount.toString())
      if (largestDescentants.count < descentantsCount) {
        largestDescentants.count = descentantsCount
        largestDescentants.elem = node as HTMLElement
      }
    }
  })
  return largestDescentants
}

export function expandToMaincontent(seed: HTMLElement, config: ExtractionConfig, centerName?: string) {
  const candidates: {
    name: string,
    desc?: string,
    el: HTMLElement,
    best?: boolean,
    seed: HTMLElement
  }[] = []

  if (config.expand.includes('ArticleTag'))
    candidates.push({
      name: 'ArticleTag',
      desc: 'Article Tag',
      el: expandUntil(seed, (el) => {
        return el.tagName === 'ARTICLE'
      }),
      seed: seed
    })

  const contentLikeClassNames = ['content', 'article']

  if (config.expand.includes('AttrSemantic'))
    candidates.push({
      name: 'AttrSemantic',
      desc: 'Tag attributes has content like name',
      el: expandUntil(seed, (el) => {
        const checkList = Array.from(el.attributes).filter(e => !e.name.startsWith('hyu')).map(attr => attr.value)
        const result = checkList.map(token =>
          contentLikeClassNames.map(name => {
            return token.toLowerCase().includes(name)
          }).some(e => e)
        )
        return result.some(e => e)
      }),
      seed: seed
    })


  const gridSize = document.querySelector('.hyu.grid')
  const gridWidth = gridSize ? gridSize.getBoundingClientRect().width : window.innerWidth / 6

  if (config.expand.includes('SizeDiff'))
    candidates.push({
      name: 'SizeDiff',
      desc: 'The element whose parent has so large width',
      el: expandUntil(seed, (current, parent) => {
        const pWidth = parent.getBoundingClientRect().width
        const cWidth = current.getBoundingClientRect().width
        if (cWidth > gridWidth * 2 &&
          (pWidth - cWidth > gridWidth || pWidth / cWidth > config.widthIncrease)) {
          return true
        }
        return false
      }),
      seed: seed
    })

  console.log(candidates)

  const maxElem = maxBy(candidates, ({ el }) => {
    if (el === document.body) return -1
    if (el.getBoundingClientRect().height < window.innerHeight / 2) return -1
    console.log('최고', el, el.id, getTextDensity(el))
    return getTextDensity(el)
  })
  if (maxElem) maxElem.best = true
  return candidates.map(candidate => ({
    centerName: centerName,
    ...candidate
  }))
}

export function expandUntil(el: HTMLElement, condition: (cur: HTMLElement, parent: HTMLElement, ...args: any[]) => boolean) {
  let parent: HTMLElement | null = el
  let current: HTMLElement = el
  while (parent = current.parentElement) {
    if (ARTICLE_BLOCK_ELEMENTS.includes(current.tagName.toLowerCase()) && condition(current, parent)) break;
    current = parent
    if (current === document.body) break;
    if (!current.parentElement) break;
  }
  return current
}