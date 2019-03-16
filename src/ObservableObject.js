
class ObservableObject extends Observable {
  constructor(obj) {
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
}
