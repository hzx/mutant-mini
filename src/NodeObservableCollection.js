
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
