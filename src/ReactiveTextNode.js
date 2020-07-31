
class ReactiveTextNode {
  constructor(ovalue, render) {
    this.id = Hasher.generate()
    this.nodeType = NODE_TYPE_TEXT_NODE
    this.node = document.createTextNode(ovalue.get())
    this.parent = null
    this.value = ovalue
    this.render = render
    this.handler = new Handler(ovalue, this.renderValue)
    this.renderValue()
  }

  renderValue = () => {
    this.node.textContent = this.render ? this.render(this.value.get()) : this.value.get()
  }

  enter() {
    this.handler.enter()
  }

  exit() {
    this.handler.exit()
  }

  setParent(parent) {
    this.parent = parent
  }

  getNode() {
    return this.node
  }
}
