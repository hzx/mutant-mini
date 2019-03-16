
class Observable {
  constructor() {
    this.handlers = {}
  }

  subscribe(handler) {
    if (!handler.hash) handler.hash = Hasher.generate()
    this.handlers[handler.hash] = handler
  }

  unsubscribe(handler) {
    if (handler.hash) delete this.handlers[handler.hash]
  }

  notify(e) {
    for (let hash in this.handlers) {
      this.handlers[hash](e)
    }
  }
}
