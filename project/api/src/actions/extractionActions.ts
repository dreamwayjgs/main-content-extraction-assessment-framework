import { appendFile } from "fs";
import { Context, Next } from "koa";
import { cloneDeep, cloneDeepWith, find, uniq } from "lodash";
import fetch from "node-fetch";
import { mongo } from "../app";
import { parseQuery } from "../utils";

// interface ElementFeatures {
//   basicFeatures: (string | number)[][]
//   answerTagged: string[]
//   distanceToCenters: number[][]
// }

// interface DocumentFeatures {
//   documentFeatures: {
//     screen: number[],
//     document: number[]
//   }
// }
export async function postExtractResult(ctx: Context) {
  const { name, pid } = ctx.params
  const result = ctx.request.body
  let duplicated = false

  console.log(name, pid, Object.keys(result))

  const existingData = await mongo.extractionResult.findFirst({
    where: {
      pid: pid,
      name: name
    }
  })

  if (existingData === null && name !== 'features' && name !== 'docFeatures') {
    console.log("New Data", name, pid)
    await mongo.extractionResult.create({
      data: {
        pid: pid,
        name: name,
        result: result
      }
    })
  } else {
    console.error("Data existed", pid, name)
    duplicated = true
  }

  ctx.body = {
    status: 'ok',
    pid: pid,
    name: name,
    duplicated
  }
}

// export async function postExtractError(ctx: Context) {
//   const { name, pid } = ctx.params
//   const result = ctx.request.body

//   console.log('에러목록', pid)
//   await mongo.extractionError.create({
//     data: {
//       pid: pid,
//       name: name,
//       error: 'Error Extraction',
//       result
//     }
//   })
//   ctx.body = {
//     status: 'ok'
//   }
// }

// export async function getTabNetExtraction(ctx: Context) {
//   const { pid } = ctx.params
//   const model = parseQuery(ctx.request.query.model)[0]

//   const pythonApi = process.env.PYTHON_API
//   console.log(pythonApi, pid, model)

//   // const positives = await (await fetch(`${pythonApi}/predict/${pid}?${model}`)).json()
//   // console.log(positives.length)

//   ctx.body = {
//     status: 'ok',
//     pid: pid,
//     positives: 0// positives
//   }
// }

// export async function getErrorPages(ctx: Context) {
//   const extracted = await mongo.extractionResult.findMany({
//     where: {
//       result: {}
//     }
//   })

//   const errors = extracted.filter(x => {
//     const { error } = x.result as any
//     if (error) return true
//     return false
//   })

//   ctx.body = {
//     status: 'ok',
//     size: errors.length,
//     errors: errors
//   }
// }

// export async function getFeatures(ctx: Context) {
//   const { pid } = ctx.params

//   const features = await mongo.elementFeatures.findFirst({
//     where: { pid: pid }
//   })

//   ctx.body = {
//     status: 'ok',
//     data: features
//   }
// }