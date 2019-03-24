
function element(name, attrs, events, childs) {
  return new Element(name, attrs, events, childs)
}

function textNode(value) {
  return new TextNode(value)
}

function component(ComponentType, ...params) {
  const c = new ComponentType(...params)
  c.element = c.render()
  return c
}

function reactiveComponent(obj, render, deps) {
  const c = new ReactiveComponent(obj, render, deps)
  c.element = c.render()
  return c
}

function reactiveElementMap(name, attrs, events, collection, render) {
  const e = new ReactiveElementMap(name, attrs, events, collection, render)
  e.children.render()
  return e
}

function reactiveTextNode(value, render) {
  return new ReactiveTextNode(value, render)
}

function isValueType(obj) {
  switch (typeof obj) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'function':
      return true
    default:
      return false
  }
}

function isArrayLike(obj) {
  return obj && obj.hasOwnProperty('length')
}

function toObservable(obj) {
  if (obj === null || obj === undefined || isValueType(obj)) {
    return toObservableValue(obj)
  } else {
    return isArrayLike(obj) ? toObservableCollection(obj) : toObservableObject(obj)
  }
}

function toObservableObject(obj) {
  const robj = {}
  for (let name in obj) {
    if (name !== 'id') {
      robj[name] = toObservable(obj[name])
    }
  }
  // skip id, must be string type
  robj.id = obj.id

  return new ObservableObject(robj)
}

function toObservableValue(value) {
  return new ObservableValue(value)
}

function toObservableCollection(arr) {
  return new ObservableCollection(arr.map(item => toObservable(item)))
}

function toObservablesArray(arr) {
  return arr.map(item => toObservable(item))
}

function div(attrs, events, childs) {
  return element('div', attrs, events, childs)
}

function span(attrs, events, childs) {
  return element('span', attrs, events, childs)
}

function render(vnode, parentNode) {
  parentNode.appendChild(getNode(vnode))
  vnode.enter()
}
