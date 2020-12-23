
class AsyncTrigger {
  constructor(handler) {
    this.handler = handler
    this.triggered = false
  }

  trigger() {
    if (this.triggered) return
    this.triggered = true

    nextTick(() => {
      this.triggered = false
      this.handler(...arguments)
    })
  }
}
