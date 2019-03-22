
function extends__(child, base) {
  var Tmp = new Function()
  Tmp.prototype = base.prototype
  child.prototype = new Tmp()
  child.prototype.constructor = child
  child.base = base.prototype
}

function arrayMap__(arr, func) {
  var a = new Array(arr.length)
  for (var i = 0; i < arr.length; ++i) {
    a[i] = func(arr[i], i, arr)
  }
  return a
}

function arrayForEach__(arr, func) {
  for (var i = 0; i < arr.length; ++i) {
    func(arr[i], i, arr)
  }
}

function arrayFilter__(arr, func) {
  var r = []
  arrayForEach__(arr, function(item, i) {
    if (func(item, i, arr)) r.push(item)
  })
  return r
}

function arrayReduce__(arr, func, initialValue) {
  var accum, first
  if (initialValue === undefined) {
    accum = arr.length > 0 ? arr[0] : null
    first = 1
  } else {
    accum = initialValue
    first = 0
  }
  for (var i = first; i < arr.length; ++i) {
    accum = func(accum, arr[i])
  }
  return accum
}

var NODE_TYPE_ELEMENT = 1
var NODE_TYPE_TEXT_NODE = 2
var NODE_TYPE_COMPONENT = 3

var OBSERVABLE_TYPE_OBJECT = 1
var OBSERVABLE_TYPE_VALUE = 2
var OBSERVABLE_TYPE_COLLECTION = 3

function Hasher() {
  this.increment = 0
}

Hasher.prototype.generate = function() {
  this.increment = this.increment >= Hasher.MAX_INCREMENT ? 0 : this.increment + 1
  return (new Date()).getTime().toString(16) + '-' + this.increment.toString(16)
}

Hasher.instance = function() {
  if (!Hasher.instance_) Hasher.instance_ = new Hasher()
  return Hasher.instance_
}

Hasher.generate = function() {
  return Hasher.instance().generate()
}

Hasher.MAX_INCREMENT = 1000000000

function Collection(items) {
  this.items = items
}

Collection.prototype.get = function(id) {
  var index = this.items.findIndex(function(item) {
    return item.id === id
  })
  return index === -1 ? null : this.items[index]
}

Collection.prototype.getNext = function(id) {
  var index = this.items.findIndex(function(item) {
    return item.id === id
  })
  var nextIndex = index + 1
  return nextIndex >= this.items.length ? null : this.items[nextIndex]
}

Collection.prototype.set = function(items) {
  this.items = items
}

Collection.prototype.getItems = function() {
  return this.items
}

Collection.prototype.size = function() {
  return this.items.length
}

Collection.prototype.forEach = function(func) {
  arrayForEach__(this.items, func)
}

Collection.prototype.map = function(func) {
  return arrayMap__(this.items, func)
}

Collection.prototype.reduce = function(func, initialValue) {
  return arrayReduce__(this.items, func, initialValue)
}

Collection.prototype.insert = function(item) {
  var items = new Array(this.items.length + 1)
  items[0] = item
  
  for (var i = 0; i < this.items.length; ++i) {
    items[i + 1] = this.items[i]
  }

  this.items = items
}

Collection.prototype.append = function(item) {
  this.items.push(item)
}

Collection.prototype.insertBefore = function(item, beforeId) {
  var beforeIndex = this.items.findIndex(function(item) {
    return item.id === beforeId
  })
  if (beforeIndex === -1) return

  var items = new Array(this.items.length + 1)
  var shift = 0

  for (var i = 0; i < this.items.length; ++i) {
    if (i === beforeIndex) {
      shift = 1
      items[i] = item
    }

    items[i + shift] = this.items[i]
  }

  this.items = items
}

Collection.prototype.move = function(id, beforeId) {
  var index = this.items.findIndex(function(item) {
    return item.id === id
  })
  var beforeIndex = this.items.findIndex(function(item) {
    return item.id === beforeId
  })
  if (index === -1 || beforeIndex === -1) {
    throw 'Collection.move: id or beforeId not found'
  }

  var items = new Array(this.items.length)
  items[beforeIndex] = this.items[index]
  var shift = 0

  for (var i = 0; i < this.items.length; ++i) {
    switch (i) {
      case index: // skip
        break;
      case indexBefore:
        shift = 1
        // fall through
      default:
        items[i + shift] = this.items[i]
        break;
    }
  }

  this.items = items
}

Collection.prototype.remove = function(id) {
  var index = this.items.findIndex(function(item) {
    return item.id === id
  })
  if (index === -1) return
  this.items = this.items.splice(index, 1)
}

Collection.prototype.empty = function() {
  this.set([])
}

Collection.prototype.isEmpty = function() {
  return this.items.length === 0
}

function Observable() {
  this.handlers_ = {}
}

Observable.prototype.subscribe = function(handler) {
  if (!handler.hash) handler.hash = Hasher.generate()
  this.handlers_[handler.hash] = handler
}

Observable.prototype.unsubscribe = function(handler) {
  if (handler.hash) delete this.handlers_[handler.hash]
}

Observable.prototype.notify = function(e) {
  for (var hash in this.handlers_) {
    this.handlers_[hash](e)
  }
}

function ObservableValue(value) {
  Observable.call(this)
  this.observableType = OBSERVABLE_TYPE_VALUE
  this.value = value
}
extends__(ObservableValue, Observable)

ObservableValue.prototype.set = function(value) {
  var old = this.value
  this.value = value
  this.notify({value, old})
}

ObservableValue.prototype.get = function() {
  return this.value
}

function ObservableObject(obj) {
  Observable.call(this)
  this.observableType = OBSERVABLE_TYPE_OBJECT
  this.obj = obj
}
extends__(ObservableObject, Observable)

// value can be ObservableObject | ObservableValue | ObservableCollection
ObservableObject.prototype.set = function(name, value) {
  this.obj[name] = value
}

ObservableObject.prototype.get = function() {
  return this.obj
}

ObservableObject.prototype.has = function(name) {
  return name in this.obj
}

ObservableObject.prototype.getValue = function(name) {
  return this.has(name) ? this.obj[name].get() : null
}

ObservableObject.prototype.getEmbeddedValue = function(names) {
  var current = this.obj
  var last = names.length - 1
  for (var i = 0; i < last; ++i) {
    current = current[names[i]]
    if (!current) return null
    if (current.observableType !== OBSERVABLE_TYPE_OBJECT) return null
    current = current.get()
  }
  return current[names[last]]
}

ObservableObject.prototype.update = function(obj) {
  for (var name in obj) {
    if (!(name in this.obj)) {
      this.obj[name] = obj[name]
    } else {
      setObjectField(this.obj, name, obj[name])
    }
  }
}

function ObservableCollection(items) {
  Collection.call(this, items)
  this.observableType = OBSERVABLE_TYPE_COLLECTION
  // events
  this.oSet = new Observable()
  this.oInsert = new Observable()
  this.oAppend = new Observable()
  this.oInsertBefore = new Observable()
  this.oMove = new Observable()
  this.oRemove = new Observable()
  this.oEmpty = new Observable()
}
extends__(ObservableCollection, Collection)

// events

ObservableCollection.prototype.subscribeSet = function(handler) {
  this.oSet.subscribe(handler)
}

ObservableCollection.prototype.unsubscribeSet = function(handler) {
  this.oSet.unsubscribe(handler)
}

ObservableCollection.prototype.subscribeInsert = function(handler) {
  this.oInsert.subscribe(handler)
}

ObservableCollection.prototype.unsubscribeInsert = function(handler) {
  this.oInsert.unsubscribe(handler)
}

ObservableCollection.prototype.subscribeAppend = function(handler) {
  this.oAppend.subscribe(handler)
}

ObservableCollection.prototype.unsubscribeAppend = function(handler) {
  this.oAppend.unsubscribe(handler)
}

ObservableCollection.prototype.subscribeInsertBefore = function(handler) {
  this.oInsertBefore.subscribe(handler)
}

ObservableCollection.prototype.unsubscribeInsertBefore = function(handler) {
  this.oInsertBefore.unsubscribe(handler)
}

ObservableCollection.prototype.subscribeMove = function(handler) {
  this.oMove.subscribe(handler)
}

ObservableCollection.prototype.unsubscribeMove = function(handler) {
  this.oMove.unsubscribe(handler)
}

ObservableCollection.prototype.subscribeRemove = function(handler) {
  this.oRemove.subscribe(handler)
}

ObservableCollection.prototype.unsubscribeRemove = function(handler) {
  this.oRemove.unsubscribe(handler)
}

ObservableCollection.prototype.subscribeEmpty = function(handler) {
  this.oEmpty.subscribe(handler)
}

ObservableCollection.prototype.unsubscribeEmpty = function(handler) {
  this.oEmpty.unsubscribe(handler)
}

// Collection methods wrap

ObservableCollection.prototype.set = function(items) {
  ObservableCollection.base.set.call(this, items)
  this.oSet.notify()
}

ObservableCollection.prototype.insert = function(item) {
  ObservableCollection.base.insert.call(this, item)
  this.oInsert.notify(item)
}

ObservableCollection.prototype.append = function(item) {
  ObservableCollection.base.append.call(this, item)
  this.oAppend.notify(item)
}

ObservableCollection.prototype.insertBefore = function(item, beforeId) {
  ObservableCollection.base.insertBefore.call(this, item, beforeId)
  this.oInsertBefore.notify({item, beforeId})
}

ObservableCollection.prototype.move = function(id, beforeId) {
  ObservableCollection.base.move.call(this, id, beforeId)
  this.oMove.notify({id, beforeId})
}

ObservableCollection.prototype.remove = function(id) {
  ObservableCollection.base.remove.call(this, id)
  this.oRemove.notify(id)
}

ObservableCollection.prototype.empty = function() {
  ObservableCollection.base.empty.call(this)
  this.oEmpty.notify(id)
}

function getNode(vnode) {
  switch (vnode.nodeType) {
    case NODE_TYPE_ELEMENT:
      // fall through
    case NODE_TYPE_TEXT_NODE:
      return vnode.node
    case NODE_TYPE_COMPONENT:
      return vnode.element.node
    default:
      console.error('error there')
      throw 'Unknown virtual node type'
  }
}

function getVirtualNode(vnode) {
  if (vnode.nodeType === NODE_TYPE_COMPONENT) return vnode.element
  // must be NODE_TYPE_ELEMENT | NODE_TYPE_TEXT_NODE
  else return vnode
}

function getVirtualNodeId(vnode) {
  return getVirtualNode(vnode).id
}

function getObjectValue(obj, dep) {
  if (typeof dep === 'string') {
    return obj[dep]
  } else { // must be array
    var ovalue = obj
    arrayForEach__(dep, function(d) {
      ovalue = ovalue[d]
    })
    return ovalue
  }
}

function setObjectField(obj, name, value) {
  var field = obj[name]
  switch (value.observableType) {
    case OBSERVABLE_TYPE_OBJECT:
      field.update(value)
      break
    case OBSERVABLE_TYPE_VALUE:
      field.set(value.get())
      break
    case OBSERVABLE_TYPE_COLLECTION:
      field.set(value.getItems())
      break
    default:
      throw `setObjectField name=${name} unknown value observableType=${value.observableType}`
  }
}

function appendNodes(parent, vnodes) {
  var pnode = getNode(parent)
  arrayForEach__(vnodes, function(vnode) {
    vnode.exit()
    pnode.appendChild(getNode(vnode))
    vnode.setParent(parent)
    if (parent.isEnter_) vnode.enter()
  })
}

function insertNode(parent, vnode) {
  var pnode = getNode(parent)
  vnode.exit()
  pnode.insertBefore(getNode(vnode), pnode.firstChild)
  vnode.setParent(parent)
  if (parent.isEnter_) vnode.enter()
}

function appendNode(parent, vnode) {
  vnode.exit()
  getNode(parent).appendChild(getNode(vnode))
  vnode.setParent(parent)
  if (parent.isEnter_) vnode.enter()
}

function insertNodeBefore(parent, vnode, before) {
  vnode.exit()
  getNode(parent).insertBefore(getNode(vnode), getNode(before))
  vnode.setParent(parent)
  if (parent.isEnter_) vnode.enter()
}

function removeNode(parent, vnode) {
  vnode.exit()
  vnode.setParent(null)
  getNode(parent).removeChild(getNode(vnode))
}

function emptyNodes(parent) {
  parent.children.forEach(function(child) {
    child.exit()
    child.setParent(null)
  })

  var pnode = getNode(parent)
  while (pnode.firstChild) pnode.removeChild(pnode.firstChild)
}

// name: String
// attrs: arr attrName to attrValue
// events: arr eventName to eventHandler
function CommonElement(name, attrs, events) {
  this.id = Hasher.generate()
  this.nodeType = NODE_TYPE_ELEMENT
  this.name = name
  this.attrs = attrs
  this.events = events
  this.node = document.createElement(name)
  this.parent = null

  this.setAttributes()
}

CommonElement.prototype.enter = function() {
  for (var i = 0; i < this.events.length; i += 2) {
    this.on(this.events[i], this.events[i + 1])
  }

  console.log('CommonElement.enter')
}

CommonElement.prototype.exit = function() {
  for (var i = 0; i < this.events.length; i += 2) {
    this.off(this.events[i], this.events[i + 1])
  }
}

CommonElement.prototype.setParent = function(vnode) {
  this.parent = vnode
}

CommonElement.prototype.remove = function() {
  if (this.parent) {
    getNode(this.parent).removeChild(this.node)
    this.parent = null
  }
}

CommonElement.prototype.on = function(name, handler) {
  this.node.addEventListener(name, handler, false)
}

CommonElement.prototype.off = function(name, handler) {
  this.node.removeEventListener(name, handler, false)
}

CommonElement.prototype.setAttribute = function(name, value) {
  this.node.setAttribute(name, value)
}

CommonElement.prototype.setAttributes = function() {
  for (var i = 0; i < this.attrs.length; i += 2) {
    this.setAttribute(this.attrs[i], this.attrs[i + 1])
  }
}

CommonElement.prototype.getAttribute = function(name) {
  return this.node.getAttribute(name)
}

CommonElement.prototype.addClass = function(name) {
  this.node.classList.add(name)
}

CommonElement.prototype.removeClass = function(name) {
  this.node.classList.remove(name)
}

CommonElement.prototype.setStyle = function(name, value) {
  this.node.style[name] = value
}

CommonElement.prototype.getStyle = function(name) {
  var cs = document.defaultView.getComputedStyle(this.node, '')
  return cs && cs.getPropertyValue(name)
}

// children: array of nodes - Element | TextNode | Component
function Element(name, attrs, events, children) {
  CommonElement.call(this, name, attrs, events)
  this.children = new NodeCollection(this, children)
  this.isEnter_ = false
}
extends__(Element, CommonElement)

Element.prototype.enter = function() {
  if (this.isEnter_) return false
  this.isEnter_ = true
  Element.base.enter.call(this)
  this.children.enter()
  return true
}

Element.prototype.exit = function() {
  if (!this.isEnter_) return false
  this.isEnter_ = false
  this.children.exit()
  Element.base.exit.call(this)
  return true
}

function TextNode(value) {
  this.id = Hasher.generate()
  this.nodeType = NODE_TYPE_TEXT_NODE
  this.node = document.createTextNode(value)
  this.parent = null
}

TextNode.prototype.enter = function() {
}

TextNode.prototype.exit = function() {
}

TextNode.prototype.get = function() {
  return this.node.textContent
}

TextNode.prototype.setParent = function(parent) {
  this.parent = parent
}

function Component() {
  this.nodeType = NODE_TYPE_COMPONENT
  this.refs = {}
  this.isEnter_ = false
  this.parent = null
}

Component.prototype.ref = function(name, node) {
  this.refs[name] = node
  return node
}

Component.prototype.render = function() {
  throw 'TODO: Override Component.render method'
}

Component.prototype.enter = function() { // enter only once, return success flag
  if (this.isEnter_) return false
  this.isEnter_ = true
  this.element.enter()
  return true
}

Component.prototype.exit = function() { // exit only once, return success flag
  if (!this.isEnter_) return false
  this.isEnter_ = false
  this.element.exit()
  return true
}

Component.prototype.setParent = function(vnode) {
  this.parent = vnode
}

function NodeCollection(parent, children) {
  Collection.call(this, children)
  this.parent = parent
  appendNodes(parent, children)
}
extends__(NodeCollection, Collection)

NodeCollection.prototype.enter = function() {
  arrayForEach__(this.items, function(item) {
    item.enter()
  })
}

NodeCollection.prototype.exit = function() {
  arrayForEach__(this.items, function(item) {
    item.exit()
  })
}

// override Collection methods

NodeCollection.prototype.set = function(items) {
  emptyNodes(this.parent)
  appendNodes(this.parent, items)
  NodeCollection.base.set.call(this, items)
}

NodeCollection.prototype.insert = function(item) {
  insertNode(this.parent, item)
  NodeCollection.base.insert.call(this, item)
}

NodeCollection.prototype.append = function(item) {
  appendNode(this.parent, item)
  NodeCollection.base.append.call(this, item)
}

NodeCollection.prototype.insertBefore = function(item, beforeId) {
  insertNodeBefore(this.parent, item, this.get(beforeId))
  NodeCollection.base.insertBefore.call(this, item, beforeId)
}

NodeCollection.prototype.move = function(id, beforeId) {
  insertNodeBefore(this.parent, this.get(id), this.get(beforeId))
  NodeCollection.base.move.call(this, id, beforeId)
}

NodeCollection.prototype.remove = function(id) {
  removeNode(this.parent, this.get(id))
  NodeCollection.base.remove.call(this, id)
}

NodeCollection.prototype.empty = function() {
  emptyNodes(this.parent)
  NodeCollection.base.empty.call(this)
}

function NodeObservableCollection(parent, collection, render) {
  NodeCollection.call(this, parent, [])
  this.collection = collection
  this.renderItem = render

  this.onSet = this.onSet.bind(this)
  this.onInsert = this.onInsert.bind(this)
  this.onAppend = this.onAppend.bind(this)
  this.onInsertBefore = this.onInsertBefore.bind(this)
  this.onMove = this.onMove.bind(this)
  this.onRemove = this.onRemove.bind(this)
  this.onEmpty= this.onEmpty.bind(this)
}
extends__(NodeObservableCollection, NodeCollection)

NodeObservableCollection.prototype.render = function() {
  var items = arrayFilter__(this.collection.map(this.renderItem),
    function(item) { return item })
  this.set(items)
}

NodeObservableCollection.prototype.enter = function() {
  NodeObservableCollection.base.enter.call(this)

  this.collection.oSet.subscribe(this.onSet)
  this.collection.oInsert.subscribe(this.onInsert)
  this.collection.oAppend.subscribe(this.onAppend)
  this.collection.oInsertBefore.subscribe(this.onInsertBefore)
  this.collection.oMove.subscribe(this.onMove)
  this.collection.oRemove.subscribe(this.onRemove)
  this.collection.oEmpty.subscribe(this.onEmpty)
}

NodeObservableCollection.prototype.exit = function() {
  NodeObservableCollection.base.exit.call(this)

  this.collection.oSet.unsubscribe(this.onSet)
  this.collection.oInsert.unsubscribe(this.onInsert)
  this.collection.oAppend.unsubscribe(this.onAppend)
  this.collection.oInsertBefore.unsubscribe(this.onInsertBefore)
  this.collection.oMove.unsubscribe(this.onMove)
  this.collection.oRemove.unsubscribe(this.onRemove)
  this.collection.oEmpty.unsubscribe(this.onEmpty)
}

NodeObservableCollection.prototype.onSet = function() {
  this.render()
}

NodeObservableCollection.prototype.onInsert = function(item) {
  var vnode = this.renderItem(item)
  if (vnode) this.insert(vnode)
}

NodeObservableCollection.prototype.onAppend = function(item) {
  var vnode = this.renderItem(item)
  if (vnode) this.append(vnode)
}

NodeObservableCollection.prototype.onInsertBefore = function({item, beforeId}) {
  var vnode = this.renderItem(item)
  if (vnode) this.insertBefore(vnode, beforeId)
}

NodeObservableCollection.prototype.onMove = function({id, beforeId}) {
  this.move(id, beforeId)
}

NodeObservableCollection.prototype.onRemove = function(id) {
  this.remove(id)
}

NodeObservableCollection.prototype.onEmpty = function() {
  this.empty()
}

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

function ReactiveTextNode(ovalue) {
  this.id = Hasher.generate()
  this.nodeType = NODE_TYPE_TEXT_NODE
  this.node = document.createTextNode(ovalue.get())
  this.parent = null
  this.value = ovalue

  this.onValueChange = this.onValueChange.bind(this)
}

ReactiveTextNode.prototype.enter = function() {
  this.value.subscribe(this.onValueChange)
}

ReactiveTextNode.prototype.exit = function() {
  this.value.unsubscribe(this.onValueChange)
}

ReactiveTextNode.prototype.setParent = function(parent) {
  this.parent = parent
}

ReactiveTextNode.prototype.onValueChange = function() {
  // node.innerText for IE
  this.node.textContent = this.ovalue.get()
}

function ReactiveElementMap(name, attrs, events, collection, render) {
  CommonElement.call(this, name, attrs, events)
  this.children = new NodeObservableCollection(this, collection, render)
  this.isEnter_ = false
}
extends__(ReactiveElementMap, CommonElement)

ReactiveElementMap.prototype.enter = function() {
  if (this.isEnter_) return false
  this.isEnter_ = true
  ReactiveElementMap.base.enter.call(this)
  this.children.enter()
  return true
}

ReactiveElementMap.prototype.exit = function() {
  if (!this.isEnter_) return false
  this.isEnter_ = false
  ReactiveElementMap.base.exit.call(this)
  this.children.exit()
  return true
}

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

export default {
  extends: extends__,
  toObservable,
  toObservableValue,
  toObservableObject,
  toObservableCollection,
  toObservablesArray,
  e: element,
  div,
  span,
  c: component,
  rc: reactiveComponent,
  rmap: reactiveElementMap,
  t: text, rt: rtext,
  Component,
  render
}
