
function Observable() {
  this.handlers_ = {}
}

Observable.prototype.subscribe = function(handler) {
  if (!handler.hash) handler.hash = Hasher.generate()
  this.handlers_[handler.hash] = handler
}

Observable.prototype.unsubscribe = function(handler) {
  if (handler.hash) delete this.handlers_[handler.hash]
}

Observable.prototype.notify = function(e) {
  for (var hash in this.handlers_) {
    this.handlers_[hash](e)
  }
}
