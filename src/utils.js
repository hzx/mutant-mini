
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
    // skip id, must be string type
    if (name !== 'id') {
      robj[name] = toObservable(obj[name])
    }
  }

  if (!obj.id) {
    robj.id = Hasher.generate()
  } else {
    robj.id = obj.id
  }

  return new ObservableObject(robj)
}

function toObservableValue(value) {
  return new ObservableValue(value)
}

function toObservableCollection(arr) {
  return new ObservableCollection(arr.map(item => toObservable(item)))
}

function toObservablesArray(arr) {
  return arr.map(item => {
    const oitem = toObservable(item)

    return oitem
  })
}

function cleanObservable(obj) {
  if (!obj.observableType) return obj

  switch (obj.observableType) {
    case OBSERVABLE_TYPE_OBJECT:
      return cleanObservableObject(obj)
    case OBSERVABLE_TYPE_VALUE:
      return cleanObservableValue(obj)
    case OBSERVABLE_TYPE_COLLECTION:
      return cleanObservableCollection(obj)
    default:
      throw new Error(`mutant.cleanObservablei unknown obj.observableType: ${obj.observableType}`)
  }
}

function cleanObservableObject(obj) {
  const cobj = {}
  for (let name in obj.obj) {
    cobj[name] = cleanObservable(obj.obj[name])
  }
  return cobj
}

function cleanObservableValue(value) {
  return value.value
}

function cleanObservableCollection(coll) {
  return coll.map(item => cleanObservable(item))
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

function decorate(ovalue, getter, setter) {
  return new ValueDecorator(ovalue, getter, setter)
}
