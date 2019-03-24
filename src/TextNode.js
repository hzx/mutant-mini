
class TextNode {
  constructor(value) {
    this.id = Hasher.generate()
    this.nodeType = NODE_TYPE_TEXT_NODE
    this.node = document.createTextNode(value)
    this.parent = null
  }

  enter() {
  }

  exit() {
  }

  get() {
    return this.node.textContent
  }

  setParent(parent) {
    this.parent = parent
  }

  getNode() {
    return this.node
  }
}
