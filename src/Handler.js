
class Handler {
  constructor(observable, handler) {
    this.observable = observable
    this.handler = handler
    this.hash = observable.hash
  }

  enter() {
    this.observable.subscribe(this.handlerWrap)
    this.handleHash()
  }

  exit() {
    this.observable.unsubscribe(this.handlerWrap)
  }

  syncHash() {
    this.hash = this.observable.hash
  }

  handleHash() {
    if (this.hash !== this.observable.hash) this.handlerWrap()
  }

  handlerWrap = () => {
    this.syncHash()
    this.handler()
  }
}

class CollectionHandler extends Handler {
  enter() {
    this.observable.oSet.subscribe(this.handlerWrap)
    this.handleHash()
  }

  exit() {
    this.observable.oSet.unsubscribe(this.handlerWrap)
  }
}
