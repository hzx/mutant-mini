
// this.element should be set
class Component {
  constructor() {
    this.nodeType = NODE_TYPE_COMPONENT
    this.refs = {}
  }

  ref(name, node) {
    this.refs[name] = node
    return node
  }

  render() {
    throw 'TODO: Override Component.render method'
  }
}
