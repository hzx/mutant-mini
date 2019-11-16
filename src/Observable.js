
class Observable {
  constructor() {
    this.handlers_ = {}
  }

  subscribe(handler) {
    if (!handler.hash) handler.hash = Hasher.generate()
    this.handlers_[handler.hash] = handler
  }

  unsubscribe(handler) {
    if (handler.hash) delete this.handlers_[handler.hash]
  }

  notify(e) {
    for (let hash in this.handlers_) {
      nextTick(() => {
        this.handlers_[hash](e)
      })
    }
  }
}
