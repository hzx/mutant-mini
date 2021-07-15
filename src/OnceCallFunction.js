
class OnceCallFunction {
  constructor(handler, context) {
    this.handler = handler
    this.context = context
    this.started = false
    this.finished = false
  }

  async call() {
    if (this.finished || this.started) return
    this.started = true

    try {
      if (this.context) await this.handler.apply(this.context, arguments)
      else await this.handler(...arguments)
    } finally {
      this.started = false
    }
    this.finished = true
  }
}
