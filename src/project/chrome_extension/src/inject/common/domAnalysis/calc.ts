import { getElementSize } from "../center"

export function getAreaRatio(el: HTMLElement) {
  const area = getElementSize(el)
  if (area === 0) return -1
  const spans = el.querySelectorAll('span.hyu.wrapped')
  const spansArea = Array.from(spans).reduce<number>((acc, cur) => getElementSize(cur) + acc, 0)
  const imageArea = Array.from(el.querySelectorAll('img')).reduce<number>((acc, cur) => getElementSize(cur) + acc, 0)
  return (spansArea + imageArea) / area
}

export function getTextDensity(el: HTMLElement) {
  const area = getElementSize(el)
  if (area === 0) return -1
  const spans = el.querySelectorAll('span.hyu.wrapped')
  console.log(el.tagName, el.getBoundingClientRect(), area, spans.length)
  const textArea = Array.from(spans).reduce<number>((acc, cur) => getElementSize(cur) + acc, 0)
  return textArea / area
}