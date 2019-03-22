
function TextNode(value) {
  this.id = Hasher.generate()
  this.nodeType = NODE_TYPE_TEXT_NODE
  this.node = document.createTextNode(value)
  this.parent = null
}

TextNode.prototype.enter = function() {
}

TextNode.prototype.exit = function() {
}

TextNode.prototype.get = function() {
  return this.node.textContent
}

TextNode.prototype.setParent = function(parent) {
  this.parent = parent
}
