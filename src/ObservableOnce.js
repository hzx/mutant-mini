
class ObservableOnce extends Observable {
  constructor() {
    super()
    this.finished = false
  }

  subscribe(handler) {
    if (this.finished) {
      handler()
      return
    }

    super.subscribe(handler)
  }

  notify(e) {
    this.finished = true
    super.notify(e)

    for (let hash in this.handlers_) {
      delete this.handlers_[hash]
    }
    this.handlers_ = {}
  }
}
