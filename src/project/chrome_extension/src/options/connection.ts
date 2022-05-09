import { GET } from '../common/api'

export async function checkApiServer(url: string): Promise<boolean> {
  try {
    const connected = await GET(url, 'greet')
    console.log("API Server Hello Response", connected)
    return true
  }
  catch (e) {
    return false
  }
}