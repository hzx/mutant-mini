
class NodeCollection extends Collection {
  constructor(parent, children) {
    super(children)
    this.parent = parent
  }

  enter() {
  }

  exit() {
  }

  // override Collection methods

  set(items) {
    // set items

    super.set(items)
  }

  insert(item) {
    // insert element

    super.insert(item)
  }

  append(item) {
    // append element

    super.append(item)
  }

  insertBefore(item, beforeId) {
    // insertBefore element

    super.insertBefore(item, beforeId)
  }

  move(id, beforeId) {
    // move element

    super.move(id, beforeId)
  }

  remove(id) {
    // remove element

    super.remove(id)
  }

  empty() {
    // remove all children

    super.empty()
  }

  // helpers
}
