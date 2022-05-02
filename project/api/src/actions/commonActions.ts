import { Context } from "vm"
import { mongo } from "../app"

export async function getSources(ctx: Context) {
  const sources = await mongo.webpage.findMany({
    select: {
      source: true,
    },
    distinct: ["source"]
  })

  console.log("SOURCE", sources)
  const sourceWithSizes = sources.map(({ source }) => {
    return mongo.webpage.count({
      where: { source }
    })
  })

  const sizes = await Promise.all(sourceWithSizes)
  const results = sources.map((source, index) => {
    return {
      source: source.source,
      size: sizes[index]
    }
  })

  ctx.body = {
    status: 'ok',
    sources: results
  }
}

export async function getSource(ctx: Context) {
  const sourcename = ctx.params.name
  if (sourcename === undefined) {
    ctx.body = {
      status: 'error',
      message: 'No source name provided'
    }
    return
  }
  const pages = await mongo.webpage.findMany({
    where: { source: sourcename }
  })

  ctx.body = {
    status: 'ok',
    size: pages.length,
    pages: pages
  }
}