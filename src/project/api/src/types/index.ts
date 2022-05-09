import { Context, Next } from "koa"

type NoNextRoute = (ctx: Context) => Promise<void>
type NextRoute = (ctx: Context, next: Next) => Promise<void>

export interface AppRoute {
  path: string,
  method: 'get' | 'post' | 'put' | 'delete'
  action: NoNextRoute | NextRoute
}