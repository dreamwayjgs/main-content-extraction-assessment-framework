import { ExtractionResult } from '../../../types/models';
import { BoilernetParser } from './boilernet';
import { DomDistillerParser } from './dom-distiller';
import { MozillaParser } from './mozilla';
import { Web2TextParser } from './web2text';


export function getParser(result: ExtractionResult) {
  const { name } = result
  console.log("parser", name)
  try {
    if (name === 'mozilla') return new MozillaParser(result)
    else if (name === 'boilernet') return new BoilernetParser(result)
    else if (name === 'web2text') return new Web2TextParser(result)
    else if (name === 'dom-distiller') return new DomDistillerParser(result)
    else throw new Error("Unknow Extraction Method:" + name)
  }
  catch (err) {
    console.error(err)
    return null
  }
}