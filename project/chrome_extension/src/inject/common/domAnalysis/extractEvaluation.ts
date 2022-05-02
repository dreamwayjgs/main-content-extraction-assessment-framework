import { filter, maxBy, minBy, sortBy, sum, uniqBy } from "lodash"
import { elementDistance } from "."
import { ElementPosition } from "../../../types"
import { Border } from "../../Overlay/border"
import { getDocumentSize, getElementSize } from "../center"
import { elementToCenter } from "./elementRelation"

export function reportCandidates(candidates: {
  name: string, desc?: string, el: HTMLElement, centerName?: string, best?: boolean, seed: HTMLElement
}[], centers: { name: string, position: ElementPosition }[]) {
  console.log("베스트만")
  console.log(candidates)
  const allSpan = document.body.querySelectorAll('span.hyu.wrapped')
  const allTextCount = Array.from(allSpan).reduce<number>((acc, cur) => cur.textContent ? acc + cur.textContent.trim().length : 0, 0)
  const { width, height } = getDocumentSize()
  const docSize = width * height
  const spanDensity = allSpan.length / docSize
  const textDensity = allTextCount / docSize
  const visualize = true

  console.log("body 통계", width, height, spanDensity, textDensity)
  console.log(candidates)

  const readables = candidates.filter(({ el }) => el !== document.body)

  if (readables.length === 0) {
    console.log("다 바디였어. 낫 리더블")
    return {
      name: 'isNotReadable',
      el: document.createElement('span'),
      seed: document.createElement('span')
    }
  }

  console.log("필터드", readables.length)

  const calced = readables.map(candi => {
    const { name, el, centerName, seed } = candi
    const border = new Border({ color: '#ff5733', thickness: '8px' })
    border.text = `${name} - ${centerName}`
    // visualize ? border.cover(el) : 0;
    const spans = el.querySelectorAll('span.hyu.wrapped')
    const textCount = Array.from(spans).reduce<number>((acc, cur) => cur.textContent ? acc + cur.textContent.trim().length : 0, 0)
    console.log('hyu', el.getAttribute('hyu'))
    return {
      ...candi,
      data: {
        spans: spans.length,
        spanRatio: spans.length / allSpan.length,
        spanDensity: spans.length / getElementSize(el),
        texts: textCount,
        textRatio: textCount / allTextCount,
        textDensity: textCount / getElementSize(el),
        clientRect: el.getBoundingClientRect(),
        seedRect: seed.getBoundingClientRect(),
        hyuIndex: el.getAttribute('hyu')
      }
    }
  })

  const bests = calced.filter(o => o.best)
  bests.forEach(candi => {
    const border = new Border({ color: '#CC5500', thickness: '8px' })
    visualize ? border.cover(candi.el) : 0;
    border.text = `${candi.name} - ${candi.centerName} - BEST`
  })

  const result = calced.filter(o => !o.best)

  const showBest = (best: any) => {
    console.log(best.centerName, best.name, best.data, best.el)
  }

  if (bests.length > 0) {
    console.log(bests)
    console.log("max span")
    showBest(maxBy(bests, o => o.data.spans))
    console.log("max text")
    showBest(maxBy(bests, o => o.data.texts))
    result.push(maxBy(bests, o => o.data.texts)!)
    console.log("spandensity")
    showBest(maxBy(bests, o => o.data.spanDensity))
    result.push(maxBy(bests, o => o.data.spanDensity)!)
    console.log("textdensity")
    showBest(maxBy(bests, o => o.data.textDensity))
    result.push(maxBy(bests, o => o.data.textDensity)!)
    console.log("closestCenter")
    showBest(minBy(bests, o => elementToCenter(o.el)))
    result.push(minBy(bests, o => o.data.textDensity)!)

    const sortedBest = sortBy(bests, o => {
      if (o.name === 'ArticleTag') return 0
      else if (o.name === 'AttrSemantic') return 1
      else return 2
    })

    console.log("유형우선권")
    showBest(sortedBest[0])
    bests.length > 2 ? showBest(sortedBest[1]) : 0

    // return minBy(bests, o => elementToCenter(o.el))!
  }
  // ABOUT Reversed
  return bests.length > 0 ? bests[bests.length - 1] : calced[calced.length - 1]
}