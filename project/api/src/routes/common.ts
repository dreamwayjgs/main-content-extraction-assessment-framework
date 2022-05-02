import { getSource, getSources } from "../actions/commonActions";
import { AppRoute } from "../types";

export const AppRoutes: AppRoute[] = [
  {
    path: '/source',
    method: 'get',
    action: getSources
  },
  {
    path: '/source/:name',
    method: 'get',
    action: getSource
  }
]