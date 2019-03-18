
function getNode(vnode) {
  switch (vnode.nodeType) {
    case NODE_TYPE_ELEMENT:
      // fall through
    case NODE_TYPE_TEXT_NODE:
      return vnode.node
    case NODE_TYPE_COMPONENT:
      return vnode.element.node
    default:
      throw 'Unknown virtual node type'
  }
}

function getVirtualNode(vnode) {
  if (vnode.nodeType === NODE_TYPE_COMPONENT) return vnode.element
  // must be NODE_TYPE_ELEMENT | NODE_TYPE_TEXT_NODE
  else return vnode
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

function appendNodes(parent, vnodes) {
  const pnode = getNode(parent)
  vnodes.forEach(vnode => {
    pnode.appendChild(getNode(vnode))
  })
}

function insertNode(parent, vnode) {
  const pnode = getNode(parent)
  pnode.insertBefore(getNode(vnode), pnode.firstChild)
}

function appendNode(parent, vnode) {
  getNode(parent).appendChild(getNode(vnode))
}

function insertNodeBefore(parent, vnode, before) {
  getNode(parent).insertBefore(getNode(vnode), getNode(before))
}

function removeNode(parent, vnode) {
  getNode(parent).removeChild(getNode(vnode))
}

function emptyNodes(parent) {
  const pnode = getNode(parent)
  while (pnode.firstChild) pnode.removeChild(pnode.firstChild)
}
