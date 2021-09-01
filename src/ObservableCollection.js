
class ObservableCollection extends Collection {
  constructor(items) {
    super(items)
    this.observableType = OBSERVABLE_TYPE_COLLECTION
    this.updateHash()
    // events
    this.oBeforeSet = new Observable()
    this.oSet = new Observable()
    this.oInsert = new Observable()
    this.oAppend = new Observable()
    this.oInsertBefore = new Observable()
    this.oMove = new Observable()
    this.oRemove = new Observable()
    this.oEmpty = new Observable()
    this.oItemUpdate = new Observable()
    this.oSetFilter = new Observable()
  }

  set(items) {
    this.oBeforeSet.notify()
    super.set(items)
    this.updateHash()
    this.oSet.notify()
    return true
  }

  insert(item) {
    super.insert(item)
    this.updateHash()
    this.oInsert.notify(item)
  }

  insertSorted(item, compare) {
    const beforeIndex = this.items.findIndex(it => compare(it))
    const beforeId = beforeIndex >= 0 ? getCollectionItemId(this.items[beforeIndex]) : null
    this.insertBefore(item, beforeId)
  }

  append(item) {
    super.append(item)
    this.updateHash()
    this.oAppend.notify(item)
  }

  insertBefore(item, beforeId) {
    if (!beforeId) {
      this.append(item)
      return
    }
    super.insertBefore(item, beforeId)
    this.updateHash()
    this.oInsertBefore.notify({item, beforeId})
  }

  move(id, beforeId) {
    super.move(id, beforeId)
    this.updateHash()
    this.oMove.notify({id, beforeId})
  }

  remove(id) {
    const item = super.remove(id)
    this.updateHash()
    this.oRemove.notify(id)
    return item
  }

  empty() {
    super.empty()
    this.updateHash()
    this.oEmpty.notify()
  }

  setFilter(func) {
    if (super.setFilter(func)) {
      this.oSetFilter.notify()
    }
  }

  notifyItemUpdate(item) {
    this.oItemUpdate.notify(item)
  }

  clone() {
    return toObservableCollection(cleanObservable(this))
  }

  cloneToArray() {
    return toObservablesArray(cleanObservable(this))
  }

  toArray() {
    return cleanObservableCollection(this)
  }

  updateHash() {
    this.hash = Hasher.generate()
  }
}
