import { initKeyBrowse } from "./keyBrowse";

export function initCommonScripts() {
  initKeyBrowse()
}

export function getElementByHyuIndex(hyu: number | string) {
  const el = document.querySelector(`[hyu='${hyu}']`)
  if (el === null) throw new Error(`No element has index hyu=${hyu}`)
  return el as HTMLElement
}