
class ObservableObject extends Observable {
  constructor(obj) {
    super()
    this.observableType = OBSERVABLE_TYPE_OBJECT
    this.obj = obj
  }

  // value can be ObservableObject | ObservableValue
  set(name, value) {
    if (!(name in this.obj)) {
      value.subscribe(name => {
        this.notify(name)
      })
    }

    this.obj[name] = value
  }

  get() {
    return this.obj
  }
}
