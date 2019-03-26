
class Collection {
  constructor(items) {
    this.items = items
  }

  get(id) {
    const index = this.items.findIndex(item => item.id === id)
    return index === -1 ? null : this.items[index]
  }

  toString() {
    return this.items.map(item => item ? item.toString() : item).join(', ')
  }

  getNext(id) {
    const index = this.items.findIndex(item => item.id === id)
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
    const beforeIndex = this.items.findIndex(item => item.id === beforeId)
    if (beforeIndex === -1) return

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
    const index = this.items.findIndex(item => item.id === id)
    const beforeIndex = this.items.findIndex(item => item.id === beforeId)
    if (index === -1 || beforeIndex === -1) {
      throw new Error('Collection.move: id or beforeId not found')
    }

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
    const index = this.items.findIndex(item => item.id === id)
    if (index === -1) return
    this.items = this.items.splice(index, 1)
  }

  empty() {
    this.set([])
  }

  isEmpty() {
    return this.items.length === 0
  }
}
