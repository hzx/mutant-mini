
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
