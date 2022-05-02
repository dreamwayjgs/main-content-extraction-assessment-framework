import $ from 'jquery'

type Width = number
type Height = number

export interface BorderOptions {
  color?: string
  thickness?: string
}

export class Border {
  static visible = false
  static borders: Border[] = []
  id: number
  left: HTMLDivElement
  right: HTMLDivElement
  top: HTMLDivElement
  bottom: HTMLDivElement
  constructor(options?: BorderOptions) {
    this.id = Border.borders.length
    this.left = document.createElement("div")
    this.right = document.createElement("div")
    this.top = document.createElement("div")
    this.bottom = document.createElement("div")

    this.left.className = `hyu border ${this.id}`
    this.right.className = `hyu border ${this.id}`
    this.top.className = `hyu border ${this.id}`
    this.bottom.className = `hyu border ${this.id}`

    this.left.style.position = "absolute"
    this.right.style.position = "absolute"
    this.top.style.position = "absolute"
    this.bottom.style.position = "absolute"

    this.left.style.zIndex = "9999"
    this.right.style.zIndex = "9999"
    this.top.style.zIndex = "9999"
    this.bottom.style.zIndex = "9999"

    const color = options?.color && options.color === 'random' ? getRandomColor() : options?.color || 'red'
    this.color = color
    this.thickness = options?.thickness || '3px'

    this.insert()
    Border.borders.push(this)
  }

  get color() {
    return this.left.style.backgroundColor
  }

  set color(color: string) {
    this.left.style.backgroundColor = color
    this.right.style.backgroundColor = color
    this.top.style.backgroundColor = color
    this.bottom.style.backgroundColor = color
  }

  get thickness() {
    return this.left.style.width
  }

  set thickness(thickness: string) {
    this.left.style.width = thickness
    this.right.style.width = thickness
    this.top.style.height = thickness
    this.bottom.style.height = thickness
  }

  set position(position: [number, number]) {
    const w = parseInt(this.top.style.width, 10)
    const h = parseInt(this.left.style.height, 10)

    $(this.left).offset({ left: position[0], top: position[1] })
    $(this.top).offset({ left: position[0], top: position[1] })
    $(this.right).offset({ left: position[0] + w, top: position[1] })
    $(this.bottom).offset({ left: position[0], top: position[1] + h })
  }

  set size(size: [Width, Height]) {
    const w = size[0]
    const h = size[1] + "px"
    this.top.style.width = w + "px"
    this.bottom.style.width = (w + parseInt(this.thickness, 10)) + "px"
    this.left.style.height = h
    this.right.style.height = h
  }

  set text(text: string) {
    this.top.textContent = text
    this.top.style.height = 'auto'
    this.top.style.color = 'white'
  }

  cover(targetElem: HTMLElement) {
    const w = $(targetElem).width() ?? 300
    const h = $(targetElem).height() ?? 300
    this.size = [w, h]

    const offset = $(targetElem).offset()
    if (offset) this.position = [offset.left, offset.top];

    $(targetElem).attr("border", `${this.id}`)
  }

  insert() {
    document.body.appendChild(this.left)
    document.body.appendChild(this.right)
    document.body.appendChild(this.top)
    document.body.appendChild(this.bottom)
  }

  static toggle(targetElem: HTMLElement) {
    const id = $(targetElem).attr('border')
    if (id) {
      $(`.hyu.border.${id}`).toggle()
    }
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
