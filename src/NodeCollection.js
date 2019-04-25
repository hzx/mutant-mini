
class NodeCollection extends Collection {
  constructor(parent, children) {
    super(children)
    this.parent = parent
    appendNodes(parent, children)
  }

  enter() {
    this.items.forEach(item => {
      item.enter()
    })
  }

  exit() {
    this.items.forEach(item => {
      item.exit()
    })
  }

  // override Collection methods

  set(items) {
    emptyNodes(this.parent)
    appendNodes(this.parent, items)
    super.set(items)
  }

  insert(item) {
    insertNode(this.parent, item)
    super.insert(item)
  }

  append(item) {
    appendNode(this.parent, item)
    super.append(item)
  }

  insertBefore(item, beforeId) {
    if (!beforeId) {
      this.append(item)
      return
    }

    insertNodeBefore(this.parent, item, this.get(beforeId))
    super.insertBefore(item, beforeId)
  }

  move(id, beforeId) {
    if (!beforeId) {
      appendNode(this.parent, this.get(id))
    } else {
      insertNodeBefore(this.parent, this.get(id), this.get(beforeId))
    }
    super.move(id, beforeId)
  }

  remove(id) {
    removeNode(this.parent, this.get(id))
    super.remove(id)
  }

  empty() {
    emptyNodes(this.parent)
    super.empty()
  }
}
