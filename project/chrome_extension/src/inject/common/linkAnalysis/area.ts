import { sortBy } from "lodash";
import { getElementSize } from "../center";
import { getFirstVisibleParent } from "../domAnalysis";

export function expandedLinkArea(anchor: HTMLElement) {
  const anchorImages = anchor.querySelectorAll('img')
  const originalText = anchor.textContent ? anchor.textContent.trim() : ''

  // image only anchor
  if (anchorImages.length > 0 && originalText === '') {
    const size = Array.from(anchorImages).reduce<number>((acc, cur) => acc + getElementSize(cur), 0)
    return { size: size, el: anchor }
  }
  // if (originalText === '') return { size: 0, el: anchor };
  let cursor: HTMLElement = anchor
  let maxSize = getElementSize(cursor)
  while (cursor.parentElement) {
    const parentText = cursor.parentElement.textContent?.trim()
    if (parentText !== originalText) break;
    cursor = cursor.parentElement
    if (maxSize <= getElementSize(cursor)) maxSize = getElementSize(cursor);
  }
  return { size: maxSize, el: cursor }
}

export function countAnchorArea() {
  const visibleAnchorList: {
    size: number,
    el: HTMLElement
  }[] = []
  const expandedAnchorList: {
    size: number,
    el: HTMLElement
  }[] = []
  document.body.querySelectorAll("a,button,input[type=button]").forEach(node => {
    const visible = getFirstVisibleParent(node as HTMLElement)
    if (visible) {
      visible.setAttribute('anchor-area', getElementSize(visible).toString())
      visibleAnchorList.push({ size: getElementSize(visible), el: visible })
    }
    const { size: size, el: expanded } = expandedLinkArea(node as HTMLElement)
    expanded.setAttribute('expanded-anchor', size.toString())
    expandedAnchorList.push({ size: size, el: expanded })
  })

  return {
    visibleAnchorList: sortBy(visibleAnchorList, 'size').reverse(),
    expandedAnchorList: sortBy(expandedAnchorList, 'size').reverse()
  }
}

export function countAnchorAreaRatio() {
  const anchorAreaRatioList: {
    ratio: number,
    el: HTMLElement
  }[] = []
  document.body.querySelectorAll(":not(.hyu)").forEach(node => {
    const areaSize = getElementSize(node)

    if (areaSize) {
      let linkAreaSum = 0
      node.querySelectorAll('[expanded-anchor]').forEach(expanded => {
        linkAreaSum += parseInt(expanded.getAttribute('expanded-anchor')!)
      })
      const ratio = linkAreaSum / areaSize
      if (ratio > 0) {
        node.setAttribute('hyu-link-area-ratio', ratio.toString())
        anchorAreaRatioList.push({
          ratio: ratio, el: node as HTMLElement
        })
      }
    }
  })

  return sortBy(anchorAreaRatioList, 'ratio').reverse()
}