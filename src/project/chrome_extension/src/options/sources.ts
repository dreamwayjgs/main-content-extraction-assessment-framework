import { GET } from "../common/api";
import { TASK_NAME_CRAWL } from "../common/configs/crawl";
import { TASK_NAME_CURATION } from "../common/configs/curation";
import { TASK_NAME_EXTRACTION } from "../common/configs/extraction";
import { TASK_NAME_EVALUATION } from "../common/configs/evaluation";
import { getSync, setSync } from "../common/storage";
import { Source } from "../types/models";
import { generateLinks } from "./backgroundConnection";

async function getSources(url: string) {
  // TODO: If the endpoint of getting source is not /source, change the url.
  const { sources } = await GET(url, 'source')
  return sources
}

async function writeTable() {
  const sources = await getSync('sources') as Source[]
  console.log(sources)
  const tableElem = document.querySelector('table#sources tbody') as HTMLTableElement
  tableElem.innerHTML = ''

  sources.forEach(row => {
    const tr = document.createElement("tr")

    const name = document.createElement('td')
    name.innerText = row.source
    tr.appendChild(name)

    const size = document.createElement('td')
    size.innerText = row.size.toString()
    tr.appendChild(size)

    const executableTasks = [TASK_NAME_CRAWL, TASK_NAME_CURATION, TASK_NAME_EXTRACTION, TASK_NAME_EVALUATION]
    executableTasks.forEach(exe => {
      const crawlLink = generateLinks({
        request: exe,
        sourceName: row.source,
        text: `${exe}`
      })
      const td = document.createElement('td')
      td.append(crawlLink)
      tr.appendChild(td)
    })

    tableElem.appendChild(tr)
  })

  document.getElementById('status-source')!.innerText = "loaded"
}

export async function loadSources() {
  const host = await getSync('host')
  const sources = await getSources(host)
  await setSync({ sources: sources })
  await writeTable()
}

export async function refreshSources() {
  document.getElementById('status-source')!.innerText = "loading..."
  await loadSources()
}