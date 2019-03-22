
function ReactiveComponent(obj, render, deps) {
  Component.call(this)
  this.obj = obj
  this.render = render
  this.deps = deps

  this.objChanged = false

  this.objChange = this.objChange.bind(this)
  this.objChangeHandler = this.objChangeHandler(this)
}
extends__(ReactiveComponent, Component)

ReactiveComponent.prototype.render = function() {
  return this.render(this.obj)
}

ReactiveComponent.prototype.enter = function() {
  if (!ReactiveComponent.base.enter.call(this)) return

  // subscribe for each obj deps field
  var this_ = this
  arrayForEach__(this.deps, function(dep) {
    getObjectValue(this_.obj, dep).subscribe(onObjChange)
  })
}

ReactiveComponent.prototype.exit = function() {
  if (!ReactiveComponent.base.exit.call(this)) return

  var this_ = this
  arrayForEach__(this.deps, function(dep) {
    getObjectValue(this_.obj, dep).unsubscribe(onObjChange)
  })
}

ReactiveComponent.prototype.onObjChange = function() {
  // object deps changing can come from many deps values
  // handle changes once with async handle call
  if (this.objChanged) return
  this.objChanged = true
  setTimeout(this.objChangeHandler, 0)
}

ReactiveComponent.prototype.objChangeHandler = function() {
  this.objChanged = false

  // remember element node position
  var before = this.parent.children.getNext(getVirtualNodeId(this.element))
  var old = this.element
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
