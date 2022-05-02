import { getSource, getSources } from "../actions/commonActions";
import { getPage, postAnswer } from "../actions/curationActions";
import { AppRoute } from "../types";

export const AppRoutes: AppRoute[] = [
  {
    path: '/curation/source',
    method: 'get',
    action: getSources
  },
  {
    path: '/curation/source/:name',
    method: 'get',
    action: getSource
  },
  {
    path: '/curation/page/:id',
    method: 'get',
    action: getPage
  },
  {
    path: '/curation/page/:id',
    method: 'post',
    action: postAnswer
  }
]