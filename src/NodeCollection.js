
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
