
// name: String
// attrs: arr attrName to attrValue
// events: arr eventName to eventHandler
class CommonElement {
  constructor(name, attrs, events) {
    this.id = Hasher.generate()
    this.nodeType = NODE_TYPE_ELEMENT
    this.name = name
    this.attrs = attrs
    this.events = events
    this.node = document.createElement(name)
    this.parent = null

    this.setAttributes()
  }

  enter() {
    for (let i = 0; i < this.events.length; i += 2) {
      this.on(this.events[i], this.events[i + 1])
    }
  }

  exit() {
    for (let i = 0; i < this.events.length; i += 2) {
      this.off(this.events[i], this.events[i + 1])
    }
  }

  setParent(vnode) {
    this.parent = vnode
  }

  getNode() {
    return this.node
  }

  getId() {
    return this.id
  }

  remove() {
    if (this.parent) {
      getNode(this.parent).removeChild(this.node)
      this.parent = null
    }
  }

  on(name, handler) {
    this.node.addEventListener(name, handler, false)
  }

  off(name, handler) {
    this.node.removeEventListener(name, handler, false)
  }

  setAttributes() {
    for (let i = 0; i < this.attrs.length; i += 2) {
      this.setAttribute(this.attrs[i], this.attrs[i + 1])
    }
  }

  hasAttribute(name) {
    return this.node.hasAttribute(name)
  }

  setAttribute(name, value) {
    switch (name) {
      case 'checked':
        if (value) {
          this.node.setAttribute(name, '')
        } else {
          this.node.removeAttribute('checked')
        }
        break
      default:
        this.node.setAttribute(name, value)
        break
    }
  }

  getAttribute(name) {
    return this.node.getAttribute(name)
  }

  removeAttribute(name) {
    this.node.removeAttribute(name)
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
