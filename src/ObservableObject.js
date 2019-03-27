
class ObservableObject extends Observable {
  constructor(obj) {
    super()
    this.observableType = OBSERVABLE_TYPE_OBJECT
    this.obj = obj
  }

  // value can be ObservableObject | ObservableValue | ObservableCollection
  set(name, value) {
    this.obj[name] = value
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
    return this.has(name) ? this.obj[name].get() : (defaultValue || null)
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
    for (let name in obj) {
      if (!(name in this.obj)) {
        this.obj[name] = obj[name]
      } else {
        setObjectField(this.obj, name, obj[name])
      }
    }
  }
}
