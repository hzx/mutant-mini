
// name: String
// attrs: arr attrName to attrValue
// events: arr eventName to eventHandler
function CommonElement(name, attrs, events) {
  this.id = Hasher.generate()
  this.nodeType = NODE_TYPE_ELEMENT
  this.name = name
  this.attrs = attrs
  this.events = events
  this.node = document.createElement(name)
  this.parent = null

  this.setAttributes()
}

CommonElement.prototype.enter = function() {
  for (var i = 0; i < this.events.length; i += 2) {
    this.on(this.events[i], this.events[i + 1])
  }

  console.log('CommonElement.enter')
}

CommonElement.prototype.exit = function() {
  for (var i = 0; i < this.events.length; i += 2) {
    this.off(this.events[i], this.events[i + 1])
  }
}

CommonElement.prototype.setParent = function(vnode) {
  this.parent = vnode
}

CommonElement.prototype.remove = function() {
  if (this.parent) {
    getNode(this.parent).removeChild(this.node)
    this.parent = null
  }
}

CommonElement.prototype.on = function(name, handler) {
  this.node.addEventListener(name, handler, false)
}

CommonElement.prototype.off = function(name, handler) {
  this.node.removeEventListener(name, handler, false)
}

CommonElement.prototype.setAttribute = function(name, value) {
  this.node.setAttribute(name, value)
}

CommonElement.prototype.setAttributes = function() {
  for (var i = 0; i < this.attrs.length; i += 2) {
    this.setAttribute(this.attrs[i], this.attrs[i + 1])
  }
}

CommonElement.prototype.getAttribute = function(name) {
  return this.node.getAttribute(name)
}

CommonElement.prototype.addClass = function(name) {
  this.node.classList.add(name)
}

CommonElement.prototype.removeClass = function(name) {
  this.node.classList.remove(name)
}

CommonElement.prototype.setStyle = function(name, value) {
  this.node.style[name] = value
}

CommonElement.prototype.getStyle = function(name) {
  var cs = document.defaultView.getComputedStyle(this.node, '')
  return cs && cs.getPropertyValue(name)
}
