import { Answer, ExtractionResult } from "../../types/models";
import { Border, BorderOptions } from "../Overlay/border";
import { drawBorder } from "../Overlay/overlay";
import { getParser } from "./parsers";
import { flatten } from "lodash";
import { falsyFilter, nodesUnder } from "../../common";

export function markAnswers(answers: Answer[]) {
  answers.forEach(markAnswer)
}

export function markAnswer(answer: Answer) {
  const markedElem = document.querySelector(`[hyu='${answer.hyuIndex}']`)
  const colorMap = {
    nav: 'grey',
    title: 'orange',
    loginForm: 'brown',
    maincontent: 'green'
  }
  const border = drawBorder(markedElem as HTMLElement, { color: colorMap[answer.tagType] })
  console.log("Answer", answer.tagType, markedElem)
  border.text = answer.tagType

}

export function evaluate(results: ExtractionResult[], answers: Answer[]) {
  console.log("Start EVAL")
  markAnswers(answers)
  const rawTextNodes = nodesUnder(document.body, { showText: true })
  wrappingTextNodes(rawTextNodes)
  const maincontentAnswerElems = answers.filter(answer => answer.tagType === 'maincontent')
    .map(answer => ({
      answerUser: answer.userId,
      el: document.querySelector(`[hyu='${answer.hyuIndex}']`) as HTMLElement
    }))
  if (maincontentAnswerElems.length === 0) {
    console.log("no answer")
    return []
  }
  const parsers = falsyFilter(results.map(getParser))
  const evalResults = parsers.map(parser => {
    if (parser.name.includes("hyucentroid")) {
      parser.mark()
      console.log(parser.name, parser.elems)
      return parser.measure(maincontentAnswerElems)
    }
    return parser.measure(maincontentAnswerElems)
  })
  const r = falsyFilter(flatten(evalResults))
  return r
}

function markElemByHyuIndex(hyu: number | string, options?: BorderOptions) {
  const elem = document.querySelector(`[hyu='${hyu}']`)
  if (!elem) {
    console.error("Notfound", hyu)
    throw new Error('No elem found')
  }
  const border = new Border(options)
  border.cover(elem as HTMLElement)
  return border
}


function wrappingTextNodes(textNodes: Node[]) {
  textNodes.forEach(textNode => {
    const txt = textNode as CharacterData
    if (txt.data.trim() === '') return

    const newSpan = document.createElement('span')
    newSpan.appendChild(txt.cloneNode())
    newSpan.className = 'hyu wrapped evaluation'
    txt.after(newSpan)
    txt.remove()
  })
}