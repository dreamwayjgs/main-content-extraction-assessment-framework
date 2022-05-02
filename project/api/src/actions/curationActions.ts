import { readFileSync } from "fs";
import { Context, Next } from "koa";
import { mongo } from "../app";

export async function getPage(ctx: Context, next: Next) {
  const { id } = ctx.params

  const stored = await mongo.stored.findFirst({
    where: {
      pid: id
    }
  })

  if (stored !== null) {
    const { mhtmlFilePath, dataStoreId } = stored

    const file = readFileSync(mhtmlFilePath)
    ctx.set("Content-disposition", `attachment; filename=${id}.mhtml`)
    ctx.statusCode = 200
    ctx.body = file
  } else {
    ctx.body = {
      status: 'error',
      error: 'page not found',
      id: id
    }
    next()
  }
}

export async function postAnswer(ctx: Context) {
  const { id } = ctx.params
  const { tagType, hyuIndex, userId } = ctx.request.body

  console.log("post answer")

  const exist = await mongo.answer.findFirst({
    where: {
      pid: id,
      tagType: tagType,
      hyuIndex: hyuIndex,
      userId: userId
    }
  })

  if (!exist) {
    console.log(id)
    console.log(tagType, hyuIndex, userId)
    await mongo.answer.create({
      data: {
        pid: id,
        tagType: tagType,
        hyuIndex: hyuIndex,
        userId: userId
      }
    })
  }

  ctx.body = {
    status: 'ok'
  }
}