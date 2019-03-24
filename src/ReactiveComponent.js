
class ReactiveComponent extends Component {
  constructor(obj, render, deps) {
    super()
    this.obj = obj
    this.render = render
    this.deps = deps

    this.objChanged = false
  }

  render() {
    return this.render(this.obj)
  }

  enter() {
    if (!super.enter()) return

    // subscribe for each obj deps field
    this.deps.forEach(dep => {
      getObjectValue(this.obj, dep).subscribe(this.onObjChange)
    })
  }

  exit() {
    if (!super.exit()) return

    this.deps.forEach(dep => {
      getObjectValue(this.obj, dep).unsubscribe(this.onObjChange)
    })
  }

  onObjChange = () => {
    // object deps changing can come from many deps values
    // handle changes once with async handle call
    if (this.objChanged) return
    this.objChanged = true
    setTimeout(this.objChangeHandler, 0)
  }

  objChangeHandler = () => {
    this.objChanged = false

    // remember element node position
    const before = this.parent.children.getNext(getVirtualNodeId(this.element))
    const old = this.element
    // render element
    this.element = this.render(this.obj)
    this.element.id = this.obj.id // link obj.id === element.id
    // remove element
    // insertBefore or append
    old.exit()
    old.remove()
    if (before) {
      this.parent.children.insertBefore(this.element, getVirtualNodeId(before))
    } else {
      this.parent.children.append(this.element)
    }
    if (this.isEnter_) this.element.enter()
  }
}
