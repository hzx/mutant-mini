
// children: array of nodes - Element | TextNode | Component
function Element(name, attrs, events, children) {
  CommonElement.call(this, name, attrs, events)
  this.children = new NodeCollection(this, children)
  this.isEnter_ = false
}
extends__(Element, CommonElement)

Element.prototype.enter = function() {
  if (this.isEnter_) return false
  this.isEnter_ = true
  Element.base.enter.call(this)
  this.children.enter()
  return true
}

Element.prototype.exit = function() {
  if (!this.isEnter_) return false
  this.isEnter_ = false
  this.children.exit()
  Element.base.exit.call(this)
  return true
}
