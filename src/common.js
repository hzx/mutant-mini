
const NODE_TYPE_ELEMENT = 1
const NODE_TYPE_TEXT_NODE = 2
const NODE_TYPE_COMPONENT = 3

const OBSERVABLE_TYPE_OBJECT = 1
const OBSERVABLE_TYPE_VALUE = 2
const OBSERVABLE_TYPE_COLLECTION = 3

function nextTick(func) {
  setTimeout(func, 0)
}
