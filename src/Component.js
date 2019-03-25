
class Component {
  constructor() {
    this.nodeType = NODE_TYPE_COMPONENT
    this.refs = {}
    this.isEnter_ = false
    this.parent = null
  }

  ref(name, node) {
    this.refs[name] = node
    return node
  }

  render() {
    throw new Error('TODO: Override Component.render method')
  }

  enter() { // enter only once, return success flag
    if (this.isEnter_) return false
    this.isEnter_ = true
    this.element.enter()
    return true
  }

  exit() { // exit only once, return success flag
    if (!this.isEnter_) return false
    this.isEnter_ = false
    this.element.exit()
    return true
  }

  setParent(vnode) {
    this.parent = vnode
  }

  getNode() {
    return this.element.getNode()
  }

  getId() {
    return this.element.getId()
  }
}
