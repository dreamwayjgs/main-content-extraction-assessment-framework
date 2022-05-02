import { ElementPosition } from "../../../types"
import { getDocumentCenter, getScreenCenter } from "../center"

export function elementInside(el: HTMLElement, point: { left: number, top: number }) {
  const { left, top, right, bottom, width, height } = el.getBoundingClientRect()
  if (
    point.left >= left &&
    point.left <= right &&
    point.top >= top &&
    point.top <= bottom
  ) return true
  return false
}

export function elementVertexes(el: HTMLElement) {
  const { left, top, right, bottom, width, height } = el.getBoundingClientRect()

  const leftTop = { left: left, top: top }
  const rightTop = { left: right, top: top }
  const leftBottom = { left: left, top: bottom }
  const rightBottom = { left: right, top: bottom }

  return { lt: leftTop, rt: rightTop, lb: leftBottom, rb: rightBottom }
}

export function elementOverlaps(origin: HTMLElement, target: HTMLElement) {
  return !(elementAtLeft(origin, target) || elementAtRight(origin, target) ||
    elementAtTop(origin, target) || elementAtBottom(origin, target) ||
    elementContains(origin, target) || elementContains(target, origin)
  )
}

export function elementAtLeft(origin: HTMLElement, target: HTMLElement) {
  const { lt } = elementVertexes(origin)
  const { rt } = elementVertexes(target)
  const { left: leftOrigin } = lt
  const { left: rightTarget } = rt
  return rightTarget <= leftOrigin
}

export function elementAtRight(origin: HTMLElement, target: HTMLElement) {
  const { rt } = elementVertexes(origin)
  const { lt } = elementVertexes(target)
  const { left: rightOrigin } = rt
  const { left: leftTarget } = lt
  return rightOrigin <= leftTarget
}

export function elementAtTop(origin: HTMLElement, target: HTMLElement) {
  const { lt } = elementVertexes(origin)
  const { lb } = elementVertexes(target)
  const { top: topOrigin } = lt
  const { top: bottomTarget } = lb
  return bottomTarget <= topOrigin
}

export function elementAtBottom(origin: HTMLElement, target: HTMLElement) {
  const { lb } = elementVertexes(origin)
  const { lt } = elementVertexes(target)
  const { top: bottomOrigin } = lb
  const { top: topTarget } = lt
  return bottomOrigin <= topTarget
}

export function elementContains(origin: HTMLElement, target: HTMLElement) {
  const vertexes = elementVertexes(target)
  return Object.entries(vertexes).filter(([key, value]) =>
    elementInside(origin, value)
  ).length === 4
}

export function elementCenter(el: HTMLElement): ElementPosition {
  const { left, top, right, bottom } = el.getBoundingClientRect()
  return { left: (left + right) / 2, top: (top + bottom) / 2 }
}

export function elementDistance(origin: HTMLElement, target: HTMLElement | ElementPosition) {
  let targetLeft: number = 0
  let targetTop: number = 0
  if (target instanceof HTMLElement) {
    const { left, top } = elementCenter(target)
    targetLeft = left
    targetTop = top
  }
  else {
    targetLeft = target.left
    targetTop = target.top
  }
  const { left: originLeft, top: originTop } = elementCenter(origin)
  return Math.hypot(originLeft - targetLeft, originTop - targetTop)
}

export function elementToCenter(origin: HTMLElement) {
  const [sLeft, sTop] = getScreenCenter()
  const [dLeft, dTop] = getDocumentCenter()
  const [left, top] = [(sLeft + dLeft) / 2, (sTop + dTop) / 2]
  return elementDistance(origin, { left: left, top: top })
}

export function elementClosestDistance(origin: ElementPosition, target: HTMLElement) {
  const { top, left, right, bottom, width, height } = target.getBoundingClientRect()
  if (width * height === 0) return Infinity;
  const { left: x, top: y } = origin

  /*
    0 |  1   | 2
    --+------+---
    3 | else | 4
    --+------+---
    5 |  6   | 7
  */

  if (x < left && y < top) {
    return Math.hypot(x - left, y - top)
  } else if (left <= x && x < right && y < top) {
    return top - y
  } else if (right <= x && y < top) {
    return Math.hypot(x - right, y - top)
  } else if (x < left && top <= y && y < bottom) {
    return left - x
  } else if (right <= x && top <= y && y < bottom) {
    return x - right
  } else if (x < left && bottom <= y) {
    return Math.hypot(x - left, bottom - y)
  } else if (left <= x && x < right && bottom <= y) {
    return y - bottom
  } else if (right <= x && bottom <= y) {
    return Math.hypot(right - x, bottom - y)
  }
  return 0
}