import { LocalConfig } from '../../common'
import { getCurationConfig, TASK_NAME_CURATION } from '../../common/configs/curation'
import { getSync } from '../../common/storage'
import { Page } from '../../types'
import { TaskManager } from '../../types/task'
import { GET, POST } from '../utils'
import { Curation } from './curation'

export async function createCurationTask(sourceName: string) {
  console.log("START Curation", sourceName)
  const host = await getSync('host')
  const target = await GET(host, `curation/source/${sourceName}`) as {
    size: number,
    pages: Page[]
  }
  console.log("Curation Size", target.size)
  const manager = TaskManager.getInstance()

  const config = await getCurationConfig()

  // Curation has no request callback
  const requestCallback = {}
  const responseCallback = async (task: Curation, response: any, sendResponse: any) => {
    tag(response, task.currentPage.id).then(() => {
      sendResponse('OK!')
    })
    return true
  }
  const task = await manager.create<Curation>(target.pages, Curation, config, requestCallback, responseCallback)
  task.start()
}

chrome.contextMenus.create({
  id: 'CurationControl',
  title: 'Inspect pages - Control',
})

//EXAMPLE START

async function tag(response: any, pid: string) {
  const localConfig = LocalConfig.getInstance()
  const { name, hyu } = response.data
  try {
    const userId = await new Promise<string>((resolve, reject) => {
      chrome.storage.sync.get('userId', items => {
        const userId = items.userId
        if (userId === undefined) {
          console.error("UserId NOT SET")
          reject('No UserId')
        }
        resolve(userId)
      })
    })

    const params = {
      tagType: name,
      hyuIndex: hyu,
      userId: userId
    }
    const reqUrl = await POST(localConfig.host, `curation/page/${pid}`, params)
    console.log("Uploaded", reqUrl)
  }
  catch (err) {
    console.error('tagging failed', err)
  }
}
//EXAMPLE END