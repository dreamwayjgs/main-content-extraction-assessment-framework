export const GET = async (host: string, path: string = '', query?: { [key: string]: string }) => {
  const url = new URL(host)
  if (path !== '') url.pathname = path;
  const params = url.searchParams
  if (query !== undefined) {
    for (const [key, value] of Object.entries(query)) {
      params.append(key, value)
    }
  }
  try {
    const response = await (await fetch(url.toString())).json()
    return response
  }
  catch (err) {
    console.error("GET Failed")
    throw new Error(`GET Failed: ${url.toString()} / ${err}`)
  }
}

export const POST = async (host: string, path = '', data?: { [key: string]: any }) => {
  const url = new URL(host)
  if (path !== '') url.pathname = path;
  try {
    console.log("[POST]", url.toString(), data)
    await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
  }
  catch (err) {
    console.error("POST Failed")
    throw new Error(`POST Failed: ${url.toString()} / ${err}`)
  }
}

export const POST_Form = async (host: string, path = '', data?: { [key: string]: any }) => {
  const url = new URL(host)
  if (path !== '') url.pathname = path;
  try {
    console.log("[POST_Form]", url.toString(), data)
    const form = new FormData()
    if (data !== undefined) {
      for (const [key, value] of Object.entries(data)) {
        form.append(key, value)
      }
    }
    await fetch(url.toString(), {
      method: 'POST',
      body: form
    })
  }
  catch (err) {
    console.error("POST Failed")
    throw new Error(`POST Failed: ${url.toString()} / ${err}`)
  }
}