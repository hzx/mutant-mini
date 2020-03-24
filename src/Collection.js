
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

  getPrev(id) {
    const index = Collection.getIndex(this.items, id)
    const prevIndex = index - 1
    return prevIndex < 0 ? null : this.items[prevIndex]
  }

  set(items) {
    if (items) items.forEach(item => ensureCollectionItemId(item))
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

  find(func) {
    return this.items.find(func)
  }

  findIndex(func) {
    return this.items.findIndex(func)
  }

  insert(item) {
    ensureCollectionItemId(item)
    const items = new Array(this.items.length + 1)
    items[0] = item

    for (let i = 0; i < this.items.length; ++i) {
      items[i + 1] = this.items[i]
    }

    this.items = items
  }

  insertSorted(item, compare) {
    ensureCollectionItemId(item)
    const beforeIndex = this.items.findIndex(it => compare(it))
    const beforeId = beforeIndex >= 0 ? getCollectionItemId(this.items[beforeIndex]) : null
    this.insertBefore(item, beforeId)
  }

  append(item) {
    ensureCollectionItemId(item)
    this.items.push(item)
  }

  insertBefore(item, beforeId) {
    if (!beforeId) {
      this.append(item)
      return
    }

    ensureCollectionItemId(item)

    const beforeIndex = Collection.getIndex(this.items, beforeId)
    if (beforeIndex === -1) throw new Error(`Collection.insertBefore beforeId="${beforeId}" not found`)

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
    if (index === -1) {
      throw new Error(`Collection.move: id="${id}" not found`)
    }

    const beforeIndex = beforeId
      ? Collection.getIndex(this.items, beforeId)
      : this.items.length // after end
    if (beforeIndex === -1) {
      throw new Error(`Collection.move: beforeId="${beforeId}" not found`)
    }

    if (index === beforeIndex || index === (beforeIndex - 1)) return

    if (index < beforeIndex) {
      const newIndex = beforeIndex - 1
      // << [index+1; newIndex)
      const backup = this.items[index]
      for (let i = index; i < newIndex; ++i) {
        this.items[i] = this.items[i + 1]
      }
      this.items[newIndex] = backup
    } else { // beforeIndex < index
      // >> [beforeIndex; index)
      const backup = this.items[index]
      for (let i = index; i > beforeIndex; --i) {
        this.items[i] = this.items[i - 1]
      }
      this.items[beforeIndex] = backup
    }
  }

  remove(id) {
    const index = Collection.getIndex(this.items, id)
    if (index === -1) return null

    const item = this.items[index]
    this.items.splice(index, 1)
    return item
  }

  empty() {
    this.set([])
  }

  isEmpty() {
    return this.items.length === 0
  }

  reverse() {
    this.items.reverse()
  }

  getPageCount(pageSize) {
    const rem = this.items.length % pageSize
    return Math.round(this.items.length / pageSize) + (rem ? 1 : 0)
  }

  getPageItems(page, pageSize) {
    const begin = page * pageSize
    return this.items.slice(begin, begin + pageSize)
  }

  static getIndex(items, id) {
    return items.findIndex((item, i, arr) => getCollectionItemId(item) === id)
  }
}
