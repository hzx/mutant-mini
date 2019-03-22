
function Component() {
  this.nodeType = NODE_TYPE_COMPONENT
  this.refs = {}
  this.isEnter_ = false
  this.parent = null
}

Component.prototype.ref = function(name, node) {
  this.refs[name] = node
  return node
}

Component.prototype.render = function() {
  throw 'TODO: Override Component.render method'
}

Component.prototype.enter = function() { // enter only once, return success flag
  if (this.isEnter_) return false
  this.isEnter_ = true
  this.element.enter()
  return true
}

Component.prototype.exit = function() { // exit only once, return success flag
  if (!this.isEnter_) return false
  this.isEnter_ = false
  this.element.exit()
  return true
}

Component.prototype.setParent = function(vnode) {
  this.parent = vnode
}
