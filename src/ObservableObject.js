
class ObservableObject extends Observable {
  constructor(obj) {
    super()
    this.observableType = OBSERVABLE_TYPE_OBJECT
    this.obj = obj
  }

  // value can be ObservableObject | ObservableValue | ObservableCollection |
  // primitive type
  set(name, value) {
    if (name in this.obj) {
      return setObjectField(this.obj, name, value)
    }

    this.obj[name] = value.observableType ? value : toObservable(value)
    return true
  }

  get() {
    return this.obj
  }

  getId() {
    return this.obj.id
  }

  toString() {
    return 'ObservableObject'
  }

  has(name) {
    return name in this.obj
  }

  getProperty(name) {
    return this.has(name) ? this.obj[name] : null
  }

  getValue(name, defaultValue) {
    if (defaultValue === undefined) defaultValue = null
    return this.has(name) ? this.obj[name].get() : defaultValue
  }

  getEmbeddedValue(names, defaultValue) {
    const prop = this.getEmbeddedProperty(names.split('.'))
    return prop ? prop.get() : defaultValue
  }

  getEmbeddedProperty(names) {
    let current = this.obj
    const last = names.length - 1
    for (let i = 0; i < last; ++i) {
      current = current[names[i]]
      if (!current) return null
      if (current.observableType !== OBSERVABLE_TYPE_OBJECT) return null
      current = current.get()
    }
    return current[names[last]]
  }

  update(obj) {
    let updated = false
    for (let name in obj) {
      if (this.set(name, obj[name])) updated = true
    }
    return updated
  }
}
