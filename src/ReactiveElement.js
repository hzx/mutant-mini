
class ReactiveElement extends CommonElement {
  constructor(name, attrs, events, obj, render, deps) {
    super(name, attrs, events)
    this.obj = obj
    this.render = render
    this.deps = deps
  }

  enter() {
  }

  exit() {
  }
}
