import { Context } from "koa";
import { find, flatten, maxBy } from "lodash";
import fetch from "node-fetch";
import { mongo } from "../app";
import { parseQuery } from "../utils";

export async function getAnswer(ctx: Context) {
  const { pid } = ctx.params
  const answers = await mongo.answer.findMany({
    where: {
      pid: pid
    }
  })
  const page = await mongo.webpage.findUnique({
    where: {
      id: pid
    }
  })
  ctx.body = {
    status: 'ok',
    answers: answers,
    page: page
  }
}


export async function getExtractionResult(ctx: Context) {
  const { pid } = ctx.params
  const name = parseQuery(ctx.request.query.name)[0]
  const startsWith = parseQuery(ctx.request.query.startsWith)[0] === 'true'

  try {
    const page = await mongo.webpage.findFirst({
      where: {
        id: pid
      },
      include: {
        ExtractionResult: true
      }
    })

    if (!page) {
      throw new Error(`Webpage Not Found: ${pid}`)
    }
    const extResults = name === '' ? page.ExtractionResult : page.ExtractionResult.filter(e => {
      return startsWith ? e.name.startsWith(name) : e.name === name
    })

    const extractionResults = extResults.map(({ name, result }) => {
      if (name === 'mozilla') {
        const { answerIndex, isReadable } = result as any
        return {
          name: 'mozilla',
          userId: 'mozilla',
          tagType: 'maincontent',
          hyuIndex: answerIndex,
          isReadable: isReadable
        }
      }
      else return null
    }).filter(e => e)

    const results = flatten(extractionResults)

    ctx.body = {
      status: 'ok',
      results: results
    }

  }
  catch (err: any) {
    ctx.body = {
      status: 'error',
      error: err.message
    }
  }
}

interface MozillaParsedDocument<T = string> {
  /** article title */
  title: string;
  /** author metadata */
  byline: string;
  /** content direction */
  dir: string;
  /** HTML of processed article content */
  content: T;
  /** text content of the article (all HTML removed) */
  textContent: string;
  /** length of an article, in characters */
  length: number;
  /** article description, or short excerpt from the content */
  excerpt: string;
  siteName: string;
}

interface EvaluationMetrics {
  pid: string
  name: string
  metric: string
  answerUser: string
  values: any
  error?: string
}

export async function postMetrics(ctx: Context) {
  const { pid } = ctx.params
  const data = ctx.request.body as EvaluationMetrics[]
  console.log("입력", data)
  for (const o of data) {
    const exist = await mongo.evaluationMetrics.findFirst({
      where: {
        name: o.name,
        metric: o.metric,
        pid: pid
      }
    })
    if (exist) continue;
    console.log('Update', pid, o.name)
    await mongo.evaluationMetrics.create({
      data: {
        ...o,
        pid: pid
      }
    })
  }

  console.log("Metric updated", pid)

  ctx.body = {
    status: 'ok'
  }
}