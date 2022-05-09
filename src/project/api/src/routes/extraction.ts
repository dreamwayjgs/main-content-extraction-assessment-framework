import { getSource, getSources } from "../actions/commonActions";
import { postExtractResult } from "../actions/extractionActions";
import { AppRoute } from "../types";

export const AppRoutes = [
  {
    path: 'source',
    method: 'get',
    action: getSources
  },
  {
    path: 'source/:name',
    method: 'get',
    action: getSource
  },
  {
    path: 'result/:name/:pid',
    method: 'post',
    action: postExtractResult
  },
  // {
  //   path: 'answer/:pid',
  //   method: 'get',
  //   action: getAnswer
  // },
  // {
  //   path: 'error/:name/:pid',
  //   method: 'post',
  //   action: postExtractError
  // },
  // {
  //   path: 'status/error',
  //   method: 'get',
  //   action: getErrorPages
  // },
  // {
  //   path: 'predict/:pid',
  //   method: 'get',
  //   action: getTabNetExtraction
  // },
  // {
  //   path: 'features/:pid',
  //   method: 'get',
  //   action: getFeatures
  // }
].map(route => ({
  ...route,
  path: `/extraction/${route.path}`
})) as AppRoute[]