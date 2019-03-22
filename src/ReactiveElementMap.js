
function ReactiveElementMap(name, attrs, events, collection, render) {
  CommonElement.call(this, name, attrs, events)
  this.children = new NodeObservableCollection(this, collection, render)
  this.isEnter_ = false
}
extends__(ReactiveElementMap, CommonElement)

ReactiveElementMap.prototype.enter = function() {
  if (this.isEnter_) return false
  this.isEnter_ = true
  ReactiveElementMap.base.enter.call(this)
  this.children.enter()
  return true
}

ReactiveElementMap.prototype.exit = function() {
  if (!this.isEnter_) return false
  this.isEnter_ = false
  ReactiveElementMap.base.exit.call(this)
  this.children.exit()
  return true
}
