import { Border, BorderOptions } from "./border";

export function drawBorder(el: HTMLElement, options?: BorderOptions) {
  const border = new Border(options)
  border.cover(el)
  return border
}

export function drawDot(left: number, top: number, options?: BorderOptions) {
  const border = new Border(options)
  border.position = [left, top]
  border.size = [10, 10]
}