
class AsyncFunction {
  constructor(handler, context) {
    this.handler = handler
    this.context = context
    this.started = false
  }

  call() {
    if (this.started) return
    this.started = true

    nextTick(() => {
      this.started = false
      if (this.context) this.handler.apply(this.context, arguments)
      else this.handler(...arguments)
    })
  }
}
