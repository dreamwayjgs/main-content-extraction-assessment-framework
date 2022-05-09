import Koa from 'koa'
import Router from 'koa-router'
import koaBody from 'koa-body'
import { PrismaClient as MongoClient } from './prisma/mongo/client'
import { PrismaClient as PgClient } from './prisma/pg/client'
import serve from 'koa-static'
import { config } from 'dotenv'
import { AppRoutes } from './routes'


config()

interface RouteMethod {
  [key: string]: (...args: any[]) => any
}

export const app = new Koa()
export const mongo = new MongoClient()
export const postgres = new PgClient()

function initKoa() {
  const router = new Router()
  const routeMethod: RouteMethod = {
    post: router.post,
    get: router.get,
    put: router.put
  }

  AppRoutes.forEach(route => routeMethod[route.method].call(router, route.path, route.action))

  console.log('Active Routes')
  AppRoutes.forEach(appRoute => {
    console.log(appRoute.path, appRoute.method)
  })


  app.use(serve('static'))
  app.use(koaBody({
    multipart: true,
    jsonLimit: "300mb",
    textLimit: "300mb",
    formLimit: "300mb",
    formidable: {
      maxFileSize: 302428800,
      maxFieldsSize: 302428800,
    }
  }))
  app.use(router.routes())
  app.use(router.allowedMethods())

  const port = 8000
  app.listen(port, '0.0.0.0')
  console.log(new Date().toISOString(), `Koa running on ${port} to all hosts!`)
}

async function main() {
  initKoa()
}

main()