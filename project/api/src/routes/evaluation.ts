import { getSource, getSources } from "../actions/commonActions";
import { getAnswer, getExtractionResult, postMetrics } from "../actions/evaluationActions";
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
    path: 'answer/:pid',
    method: 'get',
    action: getAnswer
  },
  {
    path: 'extraction/:pid',
    method: 'get',
    action: getExtractionResult
  },
  {
    path: 'metrics/:pid',
    method: 'post',
    action: postMetrics
  },
  // {
  //   path: 'features/:pid',
  //   method: 'get',
  //   action: getFeatureParams
  // },
  // {
  //   path: 'experiments/center/:pid',
  //   method: 'post',
  //   action: postCenterStats
  // },
  // {
  //   path: 'experiments/nav/:pid',
  //   method: 'post',
  //   action: postNavStats
  // }
].map(route => ({
  ...route,
  path: `/evaluation/${route.path}`
})) as AppRoute[]