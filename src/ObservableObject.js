
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
