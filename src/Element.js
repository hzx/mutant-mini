
// children: array of nodes - Element | TextNode | Component
class Element extends CommonElement {
  constructor(name, attrs, events, children) {
    super(name, attrs, events)
    this.children = new NodeCollection(this, children)
    this.isEnter_ = false
  }

  enter() {
    if (this.isEnter_) return false
    this.isEnter_ = true
    super.enter()
    this.children.enter()
    return true
  }

  exit() {
    if (!this.isEnter_) return false
    this.isEnter_ = false
    this.children.exit()
    super.exit()
    return true
  }
}
