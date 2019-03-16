
class CommonElement {
  // name: String
  // attrs: map attrName to attrValue
  // events: map eventName to eventHandler
  constructor(name, attrs, events) {
    this.nodeType = NODE_TYPE_ELEMENT
    this.name = name
    this.attrs = attrs
    this.events = events
    this.node = document.createElement(name)
  }

  enter() {
    for (let name in this.events) {
      this.on(name, this.events[name])
    }
  }

  exit() {
    for (let name in this.events) {
      this.off(name, this.events[name])
    }
  }

  on(name, handler) {
    this.node.addEventListener(name, handler, false)
  }

  off(name, handler) {
    this.node.removeEventListener(name, handler, false)
  }

  setAttribute(name, value) {
    this.node.setAttribute(name, value)
  }

  getAttribute(name) {
    return this.node.getAttribute(name)
  }

  addClass(name) {
    this.node.classList.add(name)
  }

  removeClass(name) {
    this.node.classList.remove(name)
  }

  setStyle(name, value) {
    this.node.style[name] = value
  }

  getStyle(name) {
    const cs = document.defaultView.getComputedStyle(this.node, '')
    return cs && cs.getPropertyValue(name)
  }
}
