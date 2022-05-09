import { Parser } from "./parser";
import $ from 'jquery'
import { reduceWhiteSpace, nodesUnder } from "../../../common";
import { BorderOptions } from "../../Overlay/border";
import { expandUntil } from "../../common/domAnalysis";

export class DomDistillerParser extends Parser {
  setElements() {
    const { content } = this.extractionResult as { content: string }
    const parsed = $.parseHTML(content)
    console.log('파싱된애', parsed, typeof (parsed), parsed.length)
    console.log("파싱된 애 텍스트만", parsed.map(p => p.textContent))
    if (parsed.length === 0) throw new Error("Parser Cannt Created: result lenght is 0")

    const textNodes = nodesUnder(undefined, { showText: true })
    const elems: HTMLElement[] = []

    $.each(parsed, (index, el) => {
      const str = reduceWhiteSpace(el.textContent)
      if (str === '') return
      const foundIndex = textNodes.findIndex(text => reduceWhiteSpace(text.textContent) === str)
      if (foundIndex > -1) {
        const elem = textNodes[foundIndex].parentElement
        if (elem) elems.push(elem)
      }
    })

    console.log("돔결과", elems)
    return elems
  }
  setRoot() {
    if (this.elems.length === 0) throw new Error("Parser Cannot Created: root not defined")
    if (this.elems.length === 1) return this.elems[0]
    const attrName = `${this.name}-root`
    let countMax = 0
    let countMaxEl: HTMLElement | null = null
    this.elems.forEach(el => {
      expandUntil(el, (current) => {
        const rootCountAttr = current.getAttribute(attrName)
        const rootCount = rootCountAttr ? parseInt(rootCountAttr) + 1 : 1
        current.setAttribute(attrName, rootCount.toString())
        if (rootCount > countMax) {
          countMax = rootCount
          countMaxEl = current
        }
        return false
      })
    })
    if (countMaxEl) return countMaxEl;
    else {
      console.log("이런 경우가 있나?", this.elems)
      throw new Error("Parser Error");
    }
  }
  textBlocks() {
    return this.elems
  }
  mark(borderOptions?: BorderOptions) {
    const options = borderOptions || { color: '#1382ff' }
    super.mark(options)
  }
}