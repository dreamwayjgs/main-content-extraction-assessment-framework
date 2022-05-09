export { Page } from './models'
export { PauseCrawlException, PauseCurationException } from './errors'


export type ElementPosition = { left: number, top: number }

export const ARTICLE_BLOCK_ELEMENTS = [
  'article',
  'blockquote',
  'details',
  'dialog',
  'div',
  'fieldset',
  'figure',
  'form',
  'main',
  'section',
  'table',
  'body',
]