import PageNode from './pagenode'

class WebPage {
  static ATTR = "hyu";
  static IND: number
  _root_node: HTMLElement
  _nodes: string[]

  constructor(document: Document) {
    WebPage.IND = 0;
    this._root_node = document.body;
    this._nodes = [];
  }

  indexing(_parent_node: HTMLElement = this._root_node) {
    let _child_nodes = _parent_node.childNodes;
    _child_nodes.forEach((_child_node) => {
      this.indexing(<HTMLElement>_child_node);
    });
    if (_parent_node.nodeType === 1 || _parent_node.nodeType === 3) {
      if (_parent_node.nodeName.toUpperCase() === "#TEXT") {

      } else {
        let node = new PageNode(WebPage.IND, _parent_node);

        this.pushNode(node.nodeJson);
        _parent_node.setAttribute(WebPage.ATTR, WebPage.IND.toString())
        WebPage.IND++;
      }
    }
  }

  get nodes() {
    return this._nodes;
  }

  pushNode(value: string) {
    this._nodes.push(value);
  }
}

export default WebPage