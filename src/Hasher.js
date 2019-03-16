
class Hasher {
  constructor() {
    this.increment = 0
  }

  generate() {
    this.increment = this.increment >= Hasher.MAX_INCREMENT ? 0 : this.increment + 1
    return (new Date()).getTime().toString(16) + '-' + this.increment.toString(16)
  }

  static instance() {
    if (!Hasher.instance_) Hasher.instance_ = new Hasher()
    return Hasher.instance_
  }

  static generate() {
    return Hasher.instance().generate()
  }
}

Hasher.MAX_INCREMENT = 1000000000
