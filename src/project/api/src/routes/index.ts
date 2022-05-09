
import { AppRoutes as CommonRoutes } from './common';
import { AppRoutes as CrawlRoutes } from './crawl';
import { AppRoutes as CurationRoutes } from './curation'
import { AppRoutes as ExtractionRoutes } from "./extraction";
import { AppRoutes as EvaluationRoutes } from "./evaluation";
import { generateTestSet, greet } from "../actions/greet";
import { AppRoute } from "../types";

export const AppRoutes: AppRoute[] = [
  {
    path: '/greet',
    method: 'get',
    action: greet
  },
  {
    path: '/generate-test',
    method: 'get',
    action: generateTestSet
  },
]

AppRoutes.push(...CommonRoutes)
AppRoutes.push(...CrawlRoutes)
AppRoutes.push(...CurationRoutes)
AppRoutes.push(...ExtractionRoutes)
AppRoutes.push(...EvaluationRoutes)
