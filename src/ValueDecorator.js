
class ValueDecorator extends Observable {
  // from(value)
  // to(value)
  constructor(ovalue, from, to) {
    super()
    this.ovalue = ovalue
    this.from = from
    this.to = to
    this.selfSet = false
    this.ovalue.subscribe(this.onChange)
  }

  set(value) {
    if (value === this.get()) return false

    this.selfSet = true
    this.ovalue.set(this.to(value))
    return false
  }

  get() {
    return this.from(this.ovalue.get())
  }

  toString() {
    return this.get().toString()
  }

  onChange = ({value, old}) => {
    // when changed with set method- ignore it
    if (this.selfSet) {
      this.selfSet = false
      return
    }

    const from = this.from(value)
    this.set(from)
  }
}
