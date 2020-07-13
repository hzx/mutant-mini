
class ReactiveTextNode {
  constructor(ovalue, render) {
    this.id = Hasher.generate()
    this.nodeType = NODE_TYPE_TEXT_NODE
    this.node = document.createTextNode(ovalue.get())
    this.parent = null
    this.value = ovalue
    this.render = render
    this.hash = ovalue.hash
    this.onValueChange()
  }

  enter() {
    this.value.subscribe(this.onValueChange)

    if (this.hash !== this.value.hash) { // value was updated
      this.onValueChange()
    }
  }

  exit() {
    this.value.unsubscribe(this.onValueChange)
  }

  setParent(parent) {
    this.parent = parent
  }

  getNode() {
    return this.node
  }

  onValueChange = () => {
    this.node.textContent = this.render ? this.render(this.value.get()) : this.value.get()
  }
}
