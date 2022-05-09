import { Border } from "../Overlay/border"
import $ from 'jquery'

type Coordinates = [number, number]

export function createMarker(coordinates: Coordinates, color = "red", text = "marker"): HTMLElement {
  const marker = document.createElement("div")
  const textNode = document.createTextNode(text)
  marker.appendChild(textNode)
  marker.style.position = "absolute"
  $(marker).offset({ left: coordinates[0], top: coordinates[1] })
  $(marker).addClass("hyu marker")
  document.body.appendChild(marker)

  const border = new Border({ color: color, thickness: "20px" })
  border.cover(marker)
  border.text = text
  return marker
}

export function examineCenters(numOfCenters = 5): Coordinates[] {
  let count = numOfCenters > 3 ? numOfCenters : 3
  const screenCenter = getScreenCenter()
  const docCenter = getDocumentCenter()
  const centers: Coordinates[] = []
  console.log("Center 0, last", screenCenter, docCenter)

  centers.push(screenCenter)
  for (let i = 1; i <= (count - 2); i++) {
    const m = i
    const n = count - 1 - i
    const [x1, y1] = screenCenter
    const [x2, y2] = docCenter
    const x = (m * x2 + n * x1) / (m + n)
    const y = (m * y2 + n * y1) / (m + n)

    console.log("Center ", i, " ", [x, y])
    centers.push([x, y])
  }
  centers.push(docCenter)
  console.assert(centers.length === numOfCenters, "Middle count got some errors")
  console.log("Examined Centers", centers)
  return centers
}

export function examineGrids(row = 4, col = 6, coef = 2) {
  const { width: fullWidth, height: fullHeight } = getDocumentSize()
  const height = window.innerHeight / row // / 2
  const heightGrid = Math.ceil(fullHeight / height)
  const gridBoxs: HTMLDivElement[] = []
  const grids = iterGrids(row, col, coef)
  for (const { x, y, el } of grids) {
    let options = { color: 'black' }
    $(el).attr("deadzone", 'true')
    if (x > 0 && (y > 0 && y < col - 1)) {
      options.color = 'green'
      $(el).attr("deadzone", 'false')
    }
    const border = new Border(options)
    border.cover(el)
    gridBoxs.push(el)
  }
  return gridBoxs
}

export function getGrid(w: number, h: number) {
  const grid = document.querySelector(`.hyu.grid.w-${w}.h-${h}`)
  if (grid) return grid as HTMLElement
  return null
}

export function toggleGrids() {
  $('.hyu.grid').toggle()
  $('.hyu.grid').each((index, el) => {
    Border.toggle(el)
  })
}

export function* iterGrids(row: number, col: number, coef: number) {
  const { width: fullWidth, height: fullHeight } = getDocumentSize()
  const width = window.innerWidth / col
  const height = window.innerHeight / row
  const gridRow = Math.ceil(Math.min(fullHeight, window.innerHeight * coef) / height)

  console.log(`GRID SIZE ${gridRow}x${col}`, width, height)
  for (const x of [...Array(gridRow).keys()]) {
    for (const y of [...Array(col).keys()]) {
      const existGrid = document.querySelector(`.hyu.grid.x-${x}.y-${y}`)
      if (existGrid) yield { x, y, el: existGrid as HTMLDivElement, width, height, widthGrid: col, heigthGrid: gridRow }
      else {
        const gridBox = document.createElement('div')
        gridBox.textContent = `${x}, ${y}`
        gridBox.style.position = "absolute"
        $(gridBox).offset({ left: y * width, top: x * height })
        $(gridBox).addClass('hyu')
        $(gridBox).addClass('grid')
        $(gridBox).addClass(`y-${y}`)
        $(gridBox).addClass(`x-${x}`)
        $(gridBox).width(`${width}px`)
        $(gridBox).height(`${height}px`)
        document.body.appendChild(gridBox)
        yield { x, y, el: gridBox as HTMLDivElement, width, height, widthGrid: col, heigthGrid: gridRow }
      }
    }
  }
}

export function getElementSize(el: Element) {
  const { width, height } = el.getBoundingClientRect()
  return width * height
}

export function getScreenCenter(): Coordinates {
  const left = window.innerWidth / 2
  const top = window.innerHeight / 2
  return [left, top]
}

export function getDocumentCenter(): Coordinates {
  const { width, height } = getDocumentSize()

  const left = Math.min(window.innerWidth, width) / 2
  const top = height / 2
  return [left, top]
}

export function getDocumentSize() {
  const html = document.documentElement
  const body = document.body
  const height = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
  const width = Math.max(body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth);

  return { height: height, width: width }
}