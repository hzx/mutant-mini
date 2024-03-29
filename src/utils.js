
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

function reactiveElementMap(name, attrs, events, collection, render, processChildren, beforeSetChildren) {
  const e = new ReactiveElementMap(name, attrs, events, collection, render, processChildren, beforeSetChildren)
  e.children.init()
  return e
}

function reactiveElementMapWithState(name, attrs, events, collection, render) {
  const e = new ReactiveElementMap(name, attrs, events, collection, render)
  e.children.enablePassState()
  e.children.init()
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
  let value
  for (let name in obj) {
    // skip id, must be string type
    if (name !== 'id') {
      value = obj[name]
      robj[name] = value && value.observableType ? value : toObservable(value)
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

function liteToObservableCollection(arr) {
  return process(arr, (item) => toObservable(item)).then(items => {
    return new ObservableCollection(items)
  })
}

function toObservablesArray(arr) {
  return arr.map(item => toObservable(item))
}

function liteToObservablesArray(arr) {
  return process(arr, (item) => toObservable(item))
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
      throw new Error(`mutant.cleanObservable unknown obj.observableType: ${obj.observableType}`)
  }
}

function isEqual(a, b) {
  if (!a || !b || !a.observableType || !b.observableType) return a === b

  if (a.observableType !== b.observableType) throw new Error(`mutant.isEqual a.observableType (${a.observableType}) !== b.observableType (${b.observableType})`)

  switch (a.observableType) {
    case OBSERVABLE_TYPE_OBJECT:
      return isObservableObjectsEqual(a, b)
    case OBSERVABLE_TYPE_VALUE:
      return isObservableValuesEqual(a, b)
    case OBSERVABLE_TYPE_COLLECTION:
      return isObservableCollectionsEqual(a, b)
    default:
      throw new Error(`mutant.isEqual unknown a.observableType: ${a.observableType}`)
  }
}

function isObservableCollectionsEqual(a, b) {
  if (a.size() !== b.size()) return false

  const aitems = a.getItems()
  const bitems = b.getItems()
  for (let i = 0; i < aitems.length; ++i) {
    if (!isEqual(aitems[i], bitems[i])) return false
  }

  return true
}

function isObservableObjectsEqual(a, b) {
  const akeys = Object.keys(a.obj)
  const bkeys = Object.keys(b.obj)

  if (akeys.length !== bkeys.length) return false

  for (let i = 0, name; i < akeys.length; ++i) {
    name = akeys[i]
    if (name === 'id') continue // ignore id
    if (name !== bkeys[i]) return false
    if (!isEqual(a.obj[name], b.obj[name])) return false
  }

  return true
}

function isObservableValuesEqual(a, b) {
  return isEqual(a.get(), b.get())
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

function attach(vnode, parentNode, beforeNode) {
  if (beforeNode) {
    parentNode.insertBefore(getNode(vnode), beforeNode)
  } else {
    parentNode.appendChild(getNode(vnode))
  }
  vnode.enter()
}

function remove(vnode) {
  vnode.exit()
  const node = vnode.getNode()
  const parent = node.parentNode
  if (parent) {
    parent.removeChild(node)
  }
}

function decorate(ovalue, getter, setter) {
  return new ValueDecorator(ovalue, getter, setter)
}

function addJs(content) {
  const node = document.createElement('script')
  node.type = 'text/javascript'
  node.text = content

  const head = document.getElementsByTagName('head')[0]
  head.appendChild(node)

  return node
}

function addCss(content) {
  const node = document.createElement('style')
  node.type = 'text/css'

  if (node.styleSheet) {
    node.styleSheet.cssText = content
  } else {
    node.appendChild(document.createTextNode(content))
  }

  const head = document.getElementsByTagName('head')[0]
  head.appendChild(node)

  return node
}
