
function getNode(vnode) {
  switch (vnode.nodeType) {
    case NODE_TYPE_ELEMENT:
      // fall through
    case NODE_TYPE_TEXT_NODE:
      return vnode.node
    case NODE_TYPE_COMPONENT:
      return vnode.element.node
    default:
      throw new Error('Unknown virtual node type')
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
    let ovalue = obj
    dep.forEach(d => {
      ovalue = ovalue[d]
    })
    return ovalue
  }
}

function setObjectField(obj, name, value) {
  const field = obj[name]
  switch (value.observableType) {
    case OBSERVABLE_TYPE_OBJECT:
      return field.update(value)
    case OBSERVABLE_TYPE_VALUE:
      return field.set(value.get())
    case OBSERVABLE_TYPE_COLLECTION:
      field.set(value.getItems())
      return true
    default:
      if (isValueType(value)) {
        return field.set(value)
      } else {
        throw new Error(`setObjectField name=${name} unknown value observableType=${value.observableType}`)
      }
  }
}

function updateObservable(obj, data) {
  if (!obj) return false
  switch (obj.observableType) {
    case OBSERVABLE_TYPE_OBJECT:
      return updateObservableObject(obj, data)
    case OBSERVABLE_TYPE_VALUE:
      return obj.set(data)
    case OBSERVABLE_TYPE_COLLECTION:
      return updateObservableCollection(obj, data)
    default: // ignore id, non existing fields
      return false
  }
}

function updateObservableObject(obj, data) {
  let updated = false
  let prop
  for (let name in data) {
    prop = name.indexOf('.') !== -1 ? obj.getEmbeddedProperty(name.split('.')) : obj.getProperty(name)
    if (updateObservable(prop, data[name])) updated = true
  }
  return updated
}

function updateObservableCollection(coll, items) {
  if (!isArrayLike(items)) return false
  // TODO(dem) find diff, update existing items, add new
  coll.set(toObservablesArray(items))
  return true
}

function appendNodes(parent, vnodes) {
  const pnode = getNode(parent)
  vnodes.forEach(vnode => {
    vnode.exit()
    pnode.appendChild(getNode(vnode))
    vnode.setParent(parent)
    if (parent.isEnter_) vnode.enter()
  })
}

function setChildren(parent, vnodes, processChildren) {
  // TEST: to use DocumentFragment as a buffer
  // const root = document.createDocumentFragment()

  const root = getNode(parent)

  vnodes.forEach(vnode => {
    root.appendChild(getNode(vnode))
    vnode.setParent(parent)
  })

  if (processChildren) processChildren(parent)

  // const parentNode = getNode(parent)
  // parentNode.appendChild(root)

  if (parent.isEnter_) vnodes.forEach(vnode => { vnode.enter() })
}

function insertNode(parent, vnode) {
  const pnode = getNode(parent)
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
  return vnode
}

function emptyNodes(parent) {
  parent.children.forEach(child => {
    child.exit()
    child.setParent(null)
  })

  const pnode = getNode(parent)
  while (pnode.firstChild) pnode.removeChild(pnode.firstChild)
}

function setVirtualNodeId(vnode, id) {
  if (vnode.nodeType === NODE_TYPE_COMPONENT) {
    vnode.element.id = id
  } else {
    vnode.id = id
  }
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
