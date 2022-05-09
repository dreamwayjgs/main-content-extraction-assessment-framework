import { flatten, uniq } from "lodash";
import { ExtractionResult } from "../../../types/models";
import { falsyFilter } from "../../../common";
import { Border, BorderOptions } from "../../Overlay/border";
import { elementBlockMatch, elementIoU, elementLcs } from "../metrics";
import $ from 'jquery'


export interface Metric {
  metric: string
  name: string
  answerUser: string
  values: any
}

export abstract class Parser {
  elems: HTMLElement[]
  root: HTMLElement
  name: string
  constructor(
    protected extractionResult: ExtractionResult,
  ) {
    this.name = extractionResult.name
    this.elems = this.setElements()
    this.root = this.setRoot()
  }
  setRoot(): HTMLElement {
    return document.body
  }
  setElements(): HTMLElement[] {
    return []
  }
  mark(borderOptions?: BorderOptions, text?: string): void {
    const border = new Border(borderOptions)
    border.cover(this.root)
    border.text = text || this.name
  }
  textBlocks(): HTMLElement[] {
    const wrappers = flatten(this.elems.map(el => {
      const textNodes = $('span.hyu.wrapped.evaluation', el).toArray()
      return textNodes.map(textNode => textNode && textNode.textContent && textNode.textContent.trim() !== '' ? textNode : null)
    }))
    const filtered = falsyFilter(wrappers)
    const uniqueElems = uniq(filtered)
    return uniqueElems
  }
  measure(answers: { answerUser: string, el: HTMLElement }[]): Metric[] {
    console.info("Measuring", this.name, answers.length)
    const evalReports: Metric[] = []
    const iouReports = answers.map(answer => {
      const iou = elementIoU(answer.el, this.root)
      return {
        metric: 'iou',
        name: this.name,
        answerUser: answer.answerUser,
        values: iou
      }
    })
    evalReports.push(...iouReports)

    const lcsReports = answers.map(answer => {
      const lcs = elementLcs(answer.el, this.root)
      return {
        metric: 'lcs',
        name: this.name,
        answerUser: answer.answerUser,
        values: lcs
      }
    })
    evalReports.push(...lcsReports)

    const blockReports = answers.map(answer => {
      const blockMatch = elementBlockMatch(answer.el, this.textBlocks())
      return {
        metric: 'block',
        name: this.name,
        answerUser: answer.answerUser,
        values: blockMatch
      }
    })
    evalReports.push(...blockReports)

    return evalReports
  }
}
