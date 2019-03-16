
class TextNode {
  constructor(value) {
    this.node = document.createTextNode(value)
    this.nodeType = NODE_TYPE_TEXT_NODE
  }

  enter() {
  }

  exit() {
  }
}
