
class ObservableCollection extends Collection {
  constructor(items) {
    super(items)
    this.observableType = OBSERVABLE_TYPE_COLLECTION
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
  }

  set(items) {
    this.oBeforeSet.notify()
    super.set(items)
    this.oSet.notify()
  }

  insert(item) {
    super.insert(item)
    this.oInsert.notify(item)
  }

  append(item) {
    super.append(item)
    this.oAppend.notify(item)
  }

  insertBefore(item, beforeId) {
    if (!beforeId) {
      this.append(item)
      return
    }
    super.insertBefore(item, beforeId)
    this.oInsertBefore.notify({item, beforeId})
  }

  move(id, beforeId) {
    super.move(id, beforeId)
    this.oMove.notify({id, beforeId})
  }

  remove(id) {
    const item = super.remove(id)
    this.oRemove.notify(id)
    return item
  }

  empty() {
    super.empty()
    this.oEmpty.notify()
  }

  notifyItemUpdate(item) {
    this.oItemUpdate.notify(item)
  }
}
