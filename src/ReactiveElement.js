
class ReactiveElement extends Component {
  constructor(obj, render, deps) {
    super()
    this.obj = obj
    this.render = render
    this.deps = deps

    this.objChanged = false

    this.element = render(obj)
  }

  enter() {
    // subscribe for each obj deps field
    this.deps.forEach(dep => {
      getObjectValue(this.obj, dep).subscribe(onObjChange)
    })
  }

  exit() {
    this.deps.forEach(dep => {
      getObjectValue(this.obj, dep).unsubscribe(onObjChange)
    })
  }

  onObjChange() => {
    // object deps changing can come from many deps values
    // handle changes once with async handle call
    if (this.objChanged) return
    this.objChanged = true
    setTimeout(this.objChangeHandler, 0)
  }

  objChangeHandler() => {
    this.objChanged = false
    if (!this.element) return
    const node = getNode(this.element)
  }
}
