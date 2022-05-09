import PageNode from "./Minwoo/pagenode"
import WebPage from "./Minwoo/webpage"

export const inspectPage = async () => {
  return new Promise<PageNode[]>(resolve => {
    const webpage = new WebPage(document)
    webpage.indexing()
    resolve(webpage.nodes)
  })
}