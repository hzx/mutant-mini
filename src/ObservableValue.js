
function ObservableValue(value) {
  Observable.call(this)
  this.observableType = OBSERVABLE_TYPE_VALUE
  this.value = value
}
extends__(ObservableValue, Observable)

ObservableValue.prototype.set = function(value) {
  var old = this.value
  this.value = value
  this.notify({value, old})
}

ObservableValue.prototype.get = function() {
  return this.value
}
