import { uniq } from "lodash";
import { falsyFilter } from "../../common";
import { findCommonItems } from "./lcs";
import $ from 'jquery'
import { elementContains, elementOverlaps } from "../common/domAnalysis";
import { getElementSize } from "../common/center";

export function elementIoU(box1: HTMLElement, box2: HTMLElement) {
  if (elementContains(box1, box2)) {
    return { iou: getElementSize(box2) / getElementSize(box1) }
  }
  if (elementContains(box2, box1)) {
    return { iou: getElementSize(box1) / getElementSize(box2) }
  }
  if (!elementOverlaps(box1, box2)) {
    return { iou: 0 }
  }
  const { left: left1, top: top1, right: right1, bottom: bottom1 } = box1.getBoundingClientRect()
  const { left: left2, top: top2, right: right2, bottom: bottom2 } = box2.getBoundingClientRect()
  const x1 = Math.max(left1, left2)
  const y1 = Math.max(top1, top2)
  const x2 = Math.min(right1, right2)
  const y2 = Math.min(bottom1, bottom2)

  const areaIntersection = (x2 - x1) * (y2 - y1)
  const areaBox1 = getElementSize(box1)
  const areaBox2 = getElementSize(box2)
  console.assert(areaBox1 * areaBox2 !== 0, "Element Has No Area", box1, box2)
  const areaUnion = areaBox1 + areaBox2 - areaIntersection
  const iou = areaIntersection / areaUnion
  return { iou: iou }
}

export function elementLcs(answer: HTMLElement, target: HTMLElement | string) {
  const aText = answer.textContent ? answer.textContent.trim().replace(/\s\s+/g, ' ') : ''
  const tText = typeof (target) === 'string' ? target.trim().replace(/\s\s+/g, ' ') : target.textContent ? target.textContent.trim().replace(/\s\s+/g, ' ') : ''
  if (aText === '' || tText === '') {
    console.log("둘중에 하나가 내용이 없어")
    return {
      error: 'No Text'
    }
  }
  const lcs = findCommonItems(aText, tText)
  const precision = lcs.length / tText.length
  const recall = lcs.length / aText.length
  const f1 = (2 * precision * recall) / (precision + recall)
  return {
    precision: precision,
    recall: recall,
    f1: f1
  }
}

export function elementBlockMatch(answer: HTMLElement, target: HTMLElement[]) {
  const answerWrappers = uniq(falsyFilter($('span.hyu.wrapped.evaluation', answer).toArray()
    .map(textNode =>
      $(textNode).is(":visible") && textNode && textNode.textContent && textNode.textContent.trim() !== '' ?
        textNode : null)));

  const targetWappers = target.filter(el => $(el).is(":visible"))
  console.log("비지블만 걸렀는데", target.length, targetWappers.length)

  if (answerWrappers.length === 0 || targetWappers.length === 0) {
    console.error("둘중에 뭐가 문제인데", answerWrappers, targetWappers)
    return {
      precision: 0,
      recall: 0,
      f1: 0
    }
  }

  let retrieved = 0;
  for (const aWrapper of answerWrappers) {
    for (const tWrapper of targetWappers) {
      if (aWrapper === tWrapper) {
        retrieved++;
      }
    }
  }

  const precision = retrieved / targetWappers.length
  const recall = retrieved / answerWrappers.length
  const f1 = precision + recall ? (2 * precision * recall) / (precision + recall) : 0

  return {
    precision: precision,
    recall: recall,
    f1: f1
  }
}