class PageNode {
  _index_number: number
  _node: HTMLElement
  _child_nodes: PageNode[]
  _node_name: string
  _node_type: number
  _offsetLeft: number
  _offsetTop: number
  _offsetWidth: number
  _offsetHeight: number
  _textContext: string | null
  _cnt_char: number
  _clientWidth: number
  _clientHeight: number
  _top: number
  _right: number
  _bottom: number
  _left: number

  constructor(_index_number: number, _original_node: HTMLElement) {
    this._index_number = _index_number;

    this._node = _original_node;

    this._child_nodes = [];

    this._node_name = _original_node.nodeName;
    this._node_type = _original_node.nodeType;
    this._offsetLeft = _original_node.offsetLeft ? _original_node.offsetLeft : 0;

    this._offsetTop = _original_node.offsetTop ? _original_node.offsetTop : 0;
    this._offsetWidth = _original_node.offsetWidth ? _original_node.offsetWidth : 0;
    this._offsetHeight = _original_node.offsetHeight ? _original_node.offsetHeight : 0;

    this._textContext = _original_node.textContent;
    this._cnt_char = this._textContext ? this._textContext.length : 0;

    this._clientWidth = _original_node.clientWidth;
    this._clientHeight = _original_node.clientHeight;

    const { top, right, bottom, left } = _original_node.getBoundingClientRect()
    this._top = top
    this._right = right
    this._bottom = bottom
    this._left = left
  }

  push(_node: PageNode) {
    this._child_nodes.push(_node);
  }

  get textNodeNum() {
    let sum = 0;

    if (this._node.nodeName.toUpperCase() === "#TEXT") {
      sum = 1;
    } else {
      this._child_nodes.forEach(function (_child_node) {
        sum += _child_node.textNodeNum;
      });
    }

    return sum;
  }

  get cnt_links() {

    return this._node.querySelectorAll("a").length;

  }

  get nodesNum() {

    return this._node.querySelectorAll("*").length;

  }

  get node() {

    return this._node;
  }

  get nodeJson() {
    return JSON.stringify({
      node_name: this._node_name,
      hyu: this._index_number,

      offset_left: this._offsetLeft,
      offset_width: this._offsetWidth,
      offset_top: this._offsetTop,
      offset_height: this._offsetHeight,

      num_chars: this._cnt_char,
      num_tags: this.nodesNum,
      num_links: this.cnt_links,

      top: this._top,
      right: this._right,
      left: this._left,
      bottom: this._bottom
    });
  }

  get XPath() {
    if (this._node.id) {
      return `//*[@id="${this._node.id}"]`;
    }
    const parts = [];
    while (this._node && this._node.nodeType === Node.ELEMENT_NODE) {
      let nbOfPreviousSiblings = 0;
      let hasNextSiblings = false;
      let sibling = this._node.previousSibling;
      while (sibling) {
        if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE &&
          sibling.nodeName == this._node.nodeName) {
          nbOfPreviousSiblings++;
        }
        sibling = sibling.previousSibling;
      }
      sibling = this._node.nextSibling;
      while (sibling) {
        if (sibling.nodeName == this._node.nodeName) {
          hasNextSiblings = true;
          break;
        }
        sibling = sibling.nextSibling;
      }
      const prefix = this._node.prefix ? this._node.prefix + ":" : "";
      const nth = nbOfPreviousSiblings || hasNextSiblings
        ? `[${nbOfPreviousSiblings + 1}]` : "";
      parts.push(prefix + this._node.localName + nth);
      if (this._node.parentElement !== null) {
        this._node = this._node.parentElement;
      }
      else {
        console.log("END OF NODE", this._node)
      }

    }
    return parts.length ? "/" + parts.reverse().join("/") : "";
  }
}

export default PageNode