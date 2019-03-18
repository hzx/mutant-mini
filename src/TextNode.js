
class TextNode {
  constructor(value) {
    this.nodeType = NODE_TYPE_TEXT_NODE
    this.node = document.createTextNode(value)
  }

  enter() {
  }

  exit() {
  }
}
