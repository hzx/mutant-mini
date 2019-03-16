
class ReactiveElementMap extends CommonElement {
  constructor(name, attrs, events, collection, render) {
    super(name, attrs, events)
    this.children = new NodeObservableCollection(this, collection, render)
  }

  enter() {
    this.children.enter()
  }

  exit() {
    this.children.exit()
  }
}
