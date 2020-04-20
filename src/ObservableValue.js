
class ObservableValue extends Observable {
  constructor(value) {
    super()
    this.observableType = OBSERVABLE_TYPE_VALUE
    this.value = value
  }

  set(value) {
    if (this.value === value) return false

    const old = this.value
    this.value = value
    this.notify({value, old})
    return true
  }

  get() {
    return this.value
  }

  getId() {
    return this.id || this.value
  }

  toString() {
    return this.value ? this.value.toString() : this.value
  }

  clone() {
    return new ObservableValue(this.value)
  }
}
