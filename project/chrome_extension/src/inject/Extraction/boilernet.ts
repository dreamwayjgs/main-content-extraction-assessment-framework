import { uniq } from "lodash";

export function boilernetToHyuIndex(predictions: number[]) {
  const walker = document.createNodeIterator(
    document.documentElement,
    NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if ((node as Element).hasAttribute('boilernet_index')) {
          return NodeFilter.FILTER_ACCEPT;
        }
        return NodeFilter.FILTER_SKIP;
      }
    });

  let node
  const hyus: string[] = []
  while (node = walker.nextNode()) {
    const index = parseInt((node as Element).getAttribute('boilernet_index')!)
    if (Math.round(predictions[index])) {
      const parentHyu = (node as Element).closest('[hyu]')
      if (parentHyu) {
        hyus.push(parentHyu.getAttribute('hyu')!)
      }
    }
  }
  return uniq(hyus)
}