export function sleep(milliseconds: number) {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, milliseconds)
  })
}

export function sleepPerMinute(minutes: number) {
  const duration = 60000 / minutes
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, duration)
  })
}