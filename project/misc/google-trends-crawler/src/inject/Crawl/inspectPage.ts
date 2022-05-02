import WebPage from "./Minwoo/webpage"

export const inspectPage = async () => {
  return new Promise<string[]>(resolve => {
    const webpage = new WebPage(document)
    webpage.indexing()
    resolve(webpage.nodes)
  })
}