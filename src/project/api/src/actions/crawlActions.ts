import { existsSync, mkdirSync } from "fs"
import mv from "mv"
import { Context } from "vm"
import { mongo, postgres } from "../app"

export async function storePage(ctx: Context) {
  const { id, url, rawHtml, elements, isCompleted } = ctx.request.body as {
    url: string,
    elements: string,
    id: string,
    rawHtml: string,
    isCompleted: boolean
  }

  console.log("[CRAWL] Webpage Saving", id)
  const elems = JSON.parse(elements)

  let filepath = 'static/mhtml'
  if (!existsSync(filepath)) {
    mkdirSync(filepath, { recursive: true });
  }
  if (ctx.request.files && ctx.request.files.mhtml) {
    const mhtmlData = Array.isArray(ctx.request.files.mhtml) ? ctx.request.files.mhtml[0] : ctx.request.files.mhtml
    const mhtmlPath = mhtmlData.path
    filepath = `static/mhtml/${id}.mhtml`
    mv(mhtmlPath, filepath, () => {
      console.log("File moved!", filepath)
    })
  }

  const dataStore = await postgres.stored.create({
    data: {
      rawHtml: rawHtml,
      elements: elems
    }
  })

  await mongo.stored.create({
    data: {
      pid: id,
      mhtmlFilePath: filepath,
      dataStoreId: dataStore.id
    }
  })

  await mongo.webpage.update({
    where: {
      id: id
    },
    data: {
      savedDate: new Date(),
    }
  })

  ctx.body = {
    status: 'ok'
  }
}