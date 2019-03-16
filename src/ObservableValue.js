
class ObservableValue extends Observable {
  constructor(value) {
    super()
    this.value = value
  }

  set(value) {
    const old = this.value
    this.value = value
    this.notify({value, old})
  }

  get() {
    return this.value
  }
}
