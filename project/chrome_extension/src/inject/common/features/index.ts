import { Answer } from "../../../types/models";
import { getElementByHyuIndex } from "../../common";
import { examineCenters, getDocumentSize, getScreenCenter } from "../center";
import { elementDistance } from "../domAnalysis";
import $ from 'jquery'

const BASIC_FEATURE_LENGTH = 14

export function extractBasicFeatures() {
  const getBasicFeatures = (el: HTMLElement) => {
    try {
      const { left, top, right, bottom, width, height } = el.getBoundingClientRect()
      return [
        el.getAttribute('hyu') ? el.getAttribute('hyu') : '-1',
        el.tagName,
        el.querySelectorAll("*").length,
        el.querySelectorAll('a').length,
        el.textContent?.length,
        $(el).is(":visible"),
        el.offsetTop,
        el.offsetLeft,
        left,
        top,
        right,
        bottom,
        width,
        height
      ]
    }
    catch (err) {
      console.error("Feature Extraction Failed", el, err)
      return new Array(BASIC_FEATURE_LENGTH).fill(0)
    }
  }
  const nodes = featureNodeIterator()
  const featuresMap = nodes.map(getBasicFeatures)
  return featuresMap
}

export function extractAnswerTagged(answers: Answer[]) {
  const taggedAnswerFeatures = (el: HTMLElement) => {
    return el.getAttribute('hyu-answer') ? el.getAttribute('hyu-answer') : ''
  }

  const answerElems = answers.map(answer => ({
    el: getElementByHyuIndex(answer.hyuIndex),
    tag: answer.tagType
  }))
  const tagDescendants = ({ el, tag }: { el: HTMLElement, tag: string }) => {
    el.setAttribute('hyu-answer', tag)
    const descs = el.querySelectorAll('*')
    descs.forEach(child => {
      if (TAGS_TO_IGNORE.includes(child.tagName)) return;
      child.setAttribute(`hyu-answer`, `${tag}-child`)
    })
  }
  answerElems.forEach(tagDescendants)

  const nodes = featureNodeIterator()
  const featuresMap = nodes.map(taggedAnswerFeatures)
  return featuresMap
}

const NUM_OF_CENTERS = 5
export function extractElemCenterToDocumentCenters() {
  const centers = examineCenters(NUM_OF_CENTERS)
  const getDistanceFromCenters = (el: HTMLElement) => {
    try {
      const dists = centers.map(c => Math.abs(elementDistance(el, { left: c[0], top: c[1] })))
      return dists
    } catch (err) {
      return new Array(NUM_OF_CENTERS).fill(Math.abs(Math.hypot(getDocumentSize().height, getDocumentSize().width)))
    }
  }
  const nodes = featureNodeIterator()
  const featuresMap = nodes.map(getDistanceFromCenters)
  return featuresMap
}

function featureNodeIterator() {
  const walker = document.createNodeIterator(document.body, NodeFilter.SHOW_ELEMENT, {
    acceptNode(node) {
      return !bannedNode(node) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT
    }
  })
  const nodes: any[] = []
  let node
  while (node = walker.nextNode()) {
    nodes.push(node)
  }
  return nodes as HTMLElement[]
}

const TAGS_TO_IGNORE = ['head', 'iframe', 'script', 'meta', 'link', 'style', 'input', 'checkbox',
  'button', 'noscript']

function bannedNode(node: Node): boolean {
  if (node.nodeType !== Node.ELEMENT_NODE) return true

  const el = node as HTMLElement
  if (TAGS_TO_IGNORE.includes(el.tagName.toLowerCase())) return true

  return false
}

export function extractDocFeatures() {
  return {
    screen: [window.innerWidth, window.innerHeight],
    document: [getDocumentSize().width, getDocumentSize().height]
  }
}