import { getSource, getSources } from "../actions/commonActions";
import { storePage } from "../actions/crawlActions";
import { AppRoute } from "../types";

export const AppRoutes: AppRoute[] = [
  {
    path: '/crawl/source',
    method: 'get',
    action: getSources
  },
  {
    path: '/crawl/source/:name',
    method: 'get',
    action: getSource
  },
  {
    path: '/crawl',
    method: 'post',
    action: storePage
  },
]