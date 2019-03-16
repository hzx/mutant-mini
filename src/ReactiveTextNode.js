
class ReactiveTextNode {
  constructor(ovalue) {
    this.node = document.createTextNode(ovalue.get())
    this.nodeType = NODE_TYPE_TEXT_NODE
    this.value = ovalue
  }

  enter() {
    this.value.subscribe(this.onValueChange)
  }

  exit() {
    this.value.unsubscribe(this.onValueChange)
  }

  onValueChange() => {
    // node.innerText for IE
    this.node.textContent = this.ovalue.get()
  }
}
