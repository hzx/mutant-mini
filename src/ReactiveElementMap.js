
class ReactiveElementMap extends CommonElement {
  constructor(name, attrs, events, collection, render, processChildren, beforeSetChildren) {
    super(name, attrs, events)
    this.children = new NodeObservableCollection(this, collection, render, processChildren, beforeSetChildren)
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
    super.exit()
    this.children.exit()
    return true
  }
}
