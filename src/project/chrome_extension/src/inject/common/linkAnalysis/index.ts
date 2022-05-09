import { sortBy } from "lodash"
import { getFirstVisibleParent } from "../domAnalysis"

export function countLinks(root?: HTMLElement) {
  const linkList: {
    count: number,
    el: Element
  }[] = []

  document.querySelectorAll(":not(.hyu)").forEach(node => {
    const anchors = node.querySelectorAll('a').length
    if (anchors > 0) {
      node.setAttribute('hyuLinks', anchors.toString())
      linkList.push({ count: anchors, el: node })
    }
  })

  return sortBy(linkList, 'count')
}

export function countInnerLinks(innerHref?: string, root?: HTMLElement) {
  const href = innerHref || window.location.href

  document.querySelectorAll('a').forEach(node => {
    try {
      const siteUrl = new URL(href)
      const anchorUrl = new URL(node.href)
      if (siteUrl.hostname === anchorUrl.hostname) {
        const visible = getFirstVisibleParent(node)
        if (visible) {
          visible.setAttribute('hyuInnerLink', 'true')
          visible.style.outline = '3px solid yellow'
        }
      }
    }
    catch (err) {
      console.log("PASS", node)
    }
  })

  const innerLinkList: {
    count: number,
    el: Element
  }[] = []

  document.querySelectorAll(":not(.hyu)").forEach(node => {
    const anchors = node.querySelectorAll('a[hyuInnerLink]').length
    if (anchors > 0) {
      node.setAttribute('hyuInnerLinks', anchors.toString())
      innerLinkList.push({ count: anchors, el: node })
    }
  })
  return sortBy(innerLinkList, 'count')
}