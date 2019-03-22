
function Hasher() {
  this.increment = 0
}

Hasher.prototype.generate = function() {
  this.increment = this.increment >= Hasher.MAX_INCREMENT ? 0 : this.increment + 1
  return (new Date()).getTime().toString(16) + '-' + this.increment.toString(16)
}

Hasher.instance = function() {
  if (!Hasher.instance_) Hasher.instance_ = new Hasher()
  return Hasher.instance_
}

Hasher.generate = function() {
  return Hasher.instance().generate()
}

Hasher.MAX_INCREMENT = 1000000000
