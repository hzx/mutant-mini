
class Collection {
  constructor(items) {
    this.items = items
  }

  getAt(index) {
    return this.items[index]
  }

  has(id) {
    const index = Collection.getIndex(this.items, id)
    return index !== -1
  }

  get(id) {
    const index = Collection.getIndex(this.items, id)
    return index === -1 ? null : this.items[index]
  }

  toString() {
    return this.items.map(item => item ? item.toString() : item).join(', ')
  }

  getFirst() {
    return this.items.length > 0 ? this.items[0] : null
  }

  getLast() {
    return this.items.length > 0 ? this.items[this.items.length - 1] : null
  }

  getNext(id) {
    const index = Collection.getIndex(this.items, id)
    const nextIndex = index + 1
    return nextIndex >= this.items.length ? null : this.items[nextIndex]
  }

  set(items) {
    this.items = items
  }

  getItems() {
    return this.items
  }

  size() {
    return this.items.length
  }

  forEach(func) {
    this.items.forEach(func)
  }

  map(func) {
    return this.items.map(func)
  }

  reduce(func, initialValue) {
    return this.items.reduce(func, initialValue)
  }

  filter(func) {
    return this.items.filter(func)
  }

  join(delimiter) {
    return this.items.join(delimiter)
  }

  insert(item) {
    const items = new Array(this.items.length + 1)
    items[0] = item

    for (let i = 0; i < this.items.length; ++i) {
      items[i + 1] = this.items[i]
    }

    this.items = items
  }

  append(item) {
    this.items.push(item)
  }

  insertBefore(item, beforeId) {
    const beforeIndex = Collection.getIndex(this.items, beforeId)
    if (beforeIndex === -1) {
      this.append(item)
      return
    }

    const items = new Array(this.items.length + 1)
    let shift = 0

    for (let i = 0; i < this.items.length; ++i) {
      if (i === beforeIndex) {
        shift = 1
        items[i] = item
      }

      items[i + shift] = this.items[i]
    }

    this.items = items
  }

  move(id, beforeId) {
    if (id === beforeId || this.items.length <= 1) return

    const index = Collection.getIndex(this.items, id)
    const beforeIndex = Collection.getIndex(this.items, beforeId)
    if (index === -1 || beforeIndex === -1) {
      throw new Error('Collection.move: id or beforeId not found')
    }

    // shift all elements from index + 1 to the left and
    // make index element as last
    if (beforeIndex === -1) {
      const item = this.items[index]
      for (let i = index + 1; i < this.items.length; ++i) {
        this.items[i - 1] = this.items[i]
      }
      this.items[this.items.length - 1] = item
      return
    }

    // move element
    const items = new Array(this.items.length)
    items[beforeIndex] = this.items[index]
    let shift = 0

    for (let i = 0; i < this.items.length; ++i) {
      switch (i) {
        case index: // skip
          break
        case beforeIndex:
          shift = 1
          // fall through
        default:
          items[i + shift] = this.items[i]
          break
      }
    }

    this.items = items
  }

  remove(id) {
    const index = Collection.getIndex(this.items, id)
    if (index === -1) return
    this.items = this.items.splice(index, 1)
  }

  empty() {
    this.set([])
  }

  isEmpty() {
    return this.items.length === 0
  }

  static getIndex(items, id) {
    return items.findIndex(item => (item.getId ? item.getId() : item.id) === id)
  }
}
