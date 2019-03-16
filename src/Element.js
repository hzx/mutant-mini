
class Element extends CommonElement {
  // children: array of nodes - Element | TextNode | Component
  constructor(name, attrs, events, children) {
    super(name, attrs, events)
    this.children = new NodeCollection(this, children)
  }

  enter() {
  }

  exit() {
  }
}
