
function element(name, attrs, events, childs) {
  return new Element(name, attrs, events, childs)
}

function textNode(value) {
  return new TextNode(value)
}

function component(ComponentType, ...params) {
  var c = new ComponentType(...params)
  c.element = c.render()
  return c
}

function reactiveComponent(obj, render, deps) {
  var c = new ReactiveComponent(obj, render, deps)
  c.element = c.render()
  return c
}

function reactiveElementMap(name, attrs, events, collection, render) {
  var e = new ReactiveElementMap(name, attrs, events, collection, render)
  e.children.render()
  return e
}

function reactiveTextNode(value) {
  return new ReactTextNode(value)
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
  if (obj === null || obj === undefined || isValueType(obj) ) {
    return toObservableValue(obj)
  } else {
    return isArrayLike(obj) ? toObservableCollection(obj) : toObservableObject(obj)
  }
}

function toObservableObject(obj) {
  var robj = {}
  for (var name in obj) {
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
  return new ObservableCollection(arrayMap__(arr, function(item) {
    return toObservable(item)
  }))
}

function toObservablesArray(arr) {
  return arrayMap__(arr, function(item) {
    return toObservable(item)
  })
}

function div(attrs, events, childs) {
  return element('div', attrs, events, childs)
}

function span(attrs, events, childs) {
  return element('span', attrs, events, childs)
}

function text(value) {
  return new TextNode(value)
}

function rtext(value) {
  return new ReactiveTextNode(value)
}

function render(vnode, parentNode) {
  parentNode.appendChild(getNode(vnode))
  vnode.enter()
}

class TestBabeljsConstructorBugBase {
  constructor() {
    this.name = 'TestBabeljsConstructorBugBase'
  }
}

class TestBabeljsConstructorBug extends TestBabeljsConstructorBugBase {
  constructor(param1) {
    super()
    this.param1 = param1
  }
}

function testBabeljsConstructorBugFactory(ComponentType, ...params) {
  return new ComponentType(...params)
}

const test1 = testBabeljsConstructorBugFactory(TestBabeljsConstructorBug, 'foo')
console.log('test1:', test1)
