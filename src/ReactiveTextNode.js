
function ReactiveTextNode(ovalue) {
  this.id = Hasher.generate()
  this.nodeType = NODE_TYPE_TEXT_NODE
  this.node = document.createTextNode(ovalue.get())
  this.parent = null
  this.value = ovalue

  this.onValueChange = this.onValueChange.bind(this)
}

ReactiveTextNode.prototype.enter = function() {
  this.value.subscribe(this.onValueChange)
}

ReactiveTextNode.prototype.exit = function() {
  this.value.unsubscribe(this.onValueChange)
}

ReactiveTextNode.prototype.setParent = function(parent) {
  this.parent = parent
}

ReactiveTextNode.prototype.onValueChange = function() {
  // node.innerText for IE
  this.node.textContent = this.ovalue.get()
}
