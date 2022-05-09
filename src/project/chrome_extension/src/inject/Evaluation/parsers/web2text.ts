import { falsyFilter, reduceWhiteSpace, nodesUnder } from "../../../common";
import { expandUntil } from "../../common/domAnalysis";
import { BorderOptions } from "../../Overlay/border";
import { Parser } from "./parser";

export class Web2TextParser extends Parser {
  setElements() {
    const { content } = this.extractionResult as { content: string[] }
    if (content.length === 0) throw new Error("Parser Cannot Created: result lenght is 0")
    const textNodes = nodesUnder(undefined, { showText: true })
    const elems = content.map(contentText => {
      try {
        const foundIndex = textNodes.findIndex(node =>
          node.textContent && reduceWhiteSpace(node.textContent) === reduceWhiteSpace(contentText)
        )
        if (foundIndex > -1) return textNodes[foundIndex].parentElement
        return null
      }
      catch (err) {
        console.error(err)
        return null
      }
    })

    return falsyFilter(elems)
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
    const options = borderOptions || { color: '#c93eef' }
    super.mark(options)
  }
}