
type integer = number
type Promotion = any

export interface GoogleSearchResponse {
  kind: string,
  url: {
    type: string,
    template: string
  },
  queries: {
    previousPage?: [
      {
        title: string,
        totalResults: string,
        searchTerms: string,
        count: integer,
        startIndex: integer,
        startPage: integer,
        language: string,
        inputEncoding: string,
        outputEncoding: string,
        safe: string,
        cx: string,
        sort: string,
        filter: string,
        gl: string,
        cr: string,
        googleHost: string,
        disableCnTwTranslation: string,
        hq: string,
        hl: string,
        siteSearch: string,
        siteSearchFilter: string,
        exactTerms: string,
        excludeTerms: string,
        linkSite: string,
        orTerms: string,
        relatedSite: string,
        dateRestrict: string,
        lowRange: string,
        highRange: string,
        fileType: string,
        rights: string,
        searchType: string,
        imgSize: string,
        imgType: string,
        imgColorType: string,
        imgDominantColor: string
      }
    ],
    request: [
      {
        title: string,
        totalResults: string,
        searchTerms: string,
        count: integer,
        startIndex: integer,
        startPage: integer,
        language: string,
        inputEncoding: string,
        outputEncoding: string,
        safe: string,
        cx: string,
        sort: string,
        filter: string,
        gl: string,
        cr: string,
        googleHost: string,
        disableCnTwTranslation: string,
        hq: string,
        hl: string,
        siteSearch: string,
        siteSearchFilter: string,
        exactTerms: string,
        excludeTerms: string,
        linkSite: string,
        orTerms: string,
        relatedSite: string,
        dateRestrict: string,
        lowRange: string,
        highRange: string,
        fileType: string,
        rights: string,
        searchType: string,
        imgSize: string,
        imgType: string,
        imgColorType: string,
        imgDominantColor: string
      }
    ],
    nextPage?: [
      {
        title: string,
        totalResults: string,
        searchTerms: string,
        count: integer,
        startIndex: integer,
        startPage: integer,
        language: string,
        inputEncoding: string,
        outputEncoding: string,
        safe: string,
        cx: string,
        sort: string,
        filter: string,
        gl: string,
        cr: string,
        googleHost: string,
        disableCnTwTranslation: string,
        hq: string,
        hl: string,
        siteSearch: string,
        siteSearchFilter: string,
        exactTerms: string,
        excludeTerms: string,
        linkSite: string,
        orTerms: string,
        relatedSite: string,
        dateRestrict: string,
        lowRange: string,
        highRange: string,
        fileType: string,
        rights: string,
        searchType: string,
        imgSize: string,
        imgType: string,
        imgColorType: string,
        imgDominantColor: string
      }
    ]
  },
  promotions: Promotion[],
  context: any,
  searchInformation: {
    searchTime: number,
    formattedSearchTime: string,
    totalResults: string,
    formattedTotalResults: string
  },
  spelling: {
    correctedQuery: string,
    htmlCorrectedQuery: string
  },
  items: Result[]
}

export interface Result {
  kind: string,
  title: string,
  htmlTitle: string,
  link: string,
  displayLink: string,
  snippet: string,
  htmlSnippet: string,
  cacheId: string,
  formattedUrl: string,
  htmlFormattedUrl: string,
  pagemap: any,
  mime: string,
  fileFormat: string,
  image: {
    contextLink: string,
    height: integer,
    width: integer,
    byteSize: integer,
    thumbnailLink: string,
    thumbnailHeight: integer,
    thumbnailWidth: integer
  },
  labels: [
    {
      name: string,
      displayName: string,
      label_with_op: string
    }
  ]
}
