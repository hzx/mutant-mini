
class AsyncFunction {
  constructor(handler) {
    this.handler = handler
    this.started = false
  }

  call() {
    if (this.started) return
    this.started = true

    nextTick(() => {
      this.started = false
      this.handler(...arguments)
    })
  }
}
