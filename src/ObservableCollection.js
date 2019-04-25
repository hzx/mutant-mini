
class ObservableCollection extends Collection {
  constructor(items) {
    super(items)
    this.observableType = OBSERVABLE_TYPE_COLLECTION
    // events
    this.oSet = new Observable()
    this.oInsert = new Observable()
    this.oAppend = new Observable()
    this.oInsertBefore = new Observable()
    this.oMove = new Observable()
    this.oRemove = new Observable()
    this.oEmpty = new Observable()
  }

  // events

  subscribeSet(handler) {
    this.oSet.subscribe(handler)
  }

  unsubscribeSet(handler) {
    this.oSet.unsubscribe(handler)
  }

  subscribeInsert(handler) {
    this.oInsert.subscribe(handler)
  }

  unsubscribeInsert(handler) {
    this.oInsert.unsubscribe(handler)
  }

  subscribeAppend(handler) {
    this.oAppend.subscribe(handler)
  }

  unsubscribeAppend(handler) {
    this.oAppend.unsubscribe(handler)
  }

  subscribeInsertBefore(handler) {
    this.oInsertBefore.subscribe(handler)
  }

  unsubscribeInsertBefoke(handler) {
    this.oInsertBefore.unsubscribe(handler)
  }

  subscribeMove(handler) {
    this.oMove.subscribe(handler)
  }

  unsubscribeMove(handler) {
    this.oMove.unsubscribe(handler)
  }

  subscribeRemove(handler) {
    this.oRemove.subscribe(handler)
  }

  unsubscribeRemove(handler) {
    this.oRemove.unsubscribe(handler)
  }

  subscribeEmpty(handler) {
    this.oEmpty.subscribe(handler)
  }

  unsubscribeEmpty(handler) {
    this.oEmpty.unsubscribe(handler)
  }

  // Collection methods wrap

  set(items) {
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
    super.remove(id)
    this.oRemove.notify(id)
  }

  empty() {
    super.empty()
    this.oEmpty.notify()
  }
}
