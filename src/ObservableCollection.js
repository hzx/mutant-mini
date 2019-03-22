
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
