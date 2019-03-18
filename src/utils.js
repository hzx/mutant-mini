
function element(name, attrs, events, childs) {
  return new Element(name, attrs, events, childs)
}

function textNode(value) {
  return new TextNode(value)
}

function reactiveElement(name, attrs, events, obj, render, deps) {
  return new ReactiveElement(name, attrs, events, obj, render, deps)
}

function reactiveElementMap(name, attrs, events, collection, render) {
  return new ReactElementMap(name, attrs, events, collection, render)
}

function reactiveTextNode(value) {
  return new ReactTextNode(value)
}

function isSimpleType(obj) {
  switch (typeof obj) {
    case 'string':
    case 'number':
    case 'boolean':
      return true
    default:
      return false
  }
}

function isArrayLike(obj) {
  return obj && obj.hasOwnProperty('length')
}

function toObservable(obj) {
  if (obj === null || obj === undefined || isSimpleType(obj) ) {
    return toObservableValue(obj)
  } else {
    return isArrayLike(obj) ? toObservableCollection(obj) : toObservableObject(obj)
  }
}

function toObservableObject(obj) {
  const robj = {}
  for (let name in obj) {
    robj[name] = toObservable(obj[name])
  }

  return new ObservableObject(robj)
}

function toObservableValue(value) {
  return new ObservableValue(value)
}

function toObservableCollection(arr) {
  return new ObservableCollection(arr.map(item => toReactive(item)))
}

function div(attrs, events, childs) {
  return element('div', attrs, events, childs)
}

function span(attrs, events, childs) {
  return element('span', attrs, events, childs)
}

function rdiv(attrs, events, obj, render, deps) {
  return reactiveElement('div', attrs, events, obj, render, deps) {
}

function rspan(attrs, events, obj, render, deps) {
  return reactiveElement('span', attrs, events, obj, render, deps) {
}

function rmap(attrs, events, collection, render) {
  return reactiveElementMap('div', attrs, events, collection, render)
}

function text(value) {
  return new TextNode(value)
}

function rtext(value) {
  return new ReactTextNode(value)
}
