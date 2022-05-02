import { getElementByHyuIndex } from "../../common";
import { BorderOptions } from "../../Overlay/border";
import { elementIoU, elementLcs } from "../metrics";
import { Metric, Parser } from "./parser";


export class MozillaParser extends Parser {
  setElements() {
    const { hyuIndex, isReadable } = this.extractionResult
    if (isReadable && hyuIndex && hyuIndex !== -1) {
      return [getElementByHyuIndex(hyuIndex)]
    }
    console.error(`${this.name} Not Readable`)
    return []
  }
  setRoot() {
    const { hyuIndex, isReadable } = this.extractionResult
    if (isReadable && hyuIndex && hyuIndex !== -1) {
      return getElementByHyuIndex(hyuIndex)
    }
    console.error(`${this.name} Not Readable`)
    return document.body
  }
  mark(borderOptions?: BorderOptions) {
    const options = borderOptions || { color: '#b5007f' }
    super.mark(options)
  }
}