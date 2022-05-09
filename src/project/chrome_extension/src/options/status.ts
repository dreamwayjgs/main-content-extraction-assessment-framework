export function setStatus(callback: Promise<any>, prompt: {
  loading: string,
  done: string
} = {
    loading: 'loading',
    done: 'done'
  }) {
  const savingStatus = document.getElementById("savingStatus")!
  savingStatus.textContent = prompt.loading
  callback.then(() => { savingStatus.textContent = prompt.done })
}