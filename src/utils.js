
function element(name, attrs, events, childs) {
  return new Element(name, attrs, events, childs)
}

function textNode(value) {
  return new TextNode(value)
}

function reactElementMap(name, attrs, events, collection, render) {
  return new ReactElementMap(name, attrs, events, collection, render)
}

function reactTextNode(value) {
  return new ReactTextNode
}
