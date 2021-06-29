
class ObservableCollectionSync {
  constructor(source, destination) {
    this.source = source
    this.destination = destination
    this.onSet()
  }

  enter() {
    this.source.oSet.subscribe(this.onSet)
    this.source.oInsert.subscribe(this.onInsert)
    this.source.oAppend.subscribe(this.onAppend)
    this.source.oInsertBefore.subscribe(this.onInsertBefore)
    this.source.oMove.subscribe(this.onMove)
    this.source.oRemove.subscribe(this.onRemove)
    this.source.oEmpty.subscribe(this.onEmpty)

    if (this.source.hash !== this.destination.hash) this.onSet()
  }

  exit() {
    this.source.oSet.unsubscribe(this.onSet)
    this.source.oInsert.unsubscribe(this.onInsert)
    this.source.oAppend.unsubscribe(this.onAppend)
    this.source.oInsertBefore.unsubscribe(this.onInsertBefore)
    this.source.oMove.unsubscribe(this.onMove)
    this.source.oRemove.unsubscribe(this.onRemove)
    this.source.oEmpty.unsubscribe(this.onEmpty)
  }

  syncHash() {
    this.destination.hash = this.source.hash
  }

  onSet = () => {
    this.destination.set([...this.source.getItems()])
    this.syncHash()
  }

  onInsert = item => {
    this.destination.insert(item)
    this.syncHash()
  }

  onAppend = item => {
    this.destination.append(item)
    this.syncHash()
  }

  onInsertBefore = ({item, beforeId}) => {
    this.destination.insertBefore(item, beforeId)
    this.syncHash()
  }

  onMove = ({id, beforeId}) => {
    this.destination.move(id, beforeId)
    this.syncHash()
  }

  onRemove = id => {
    this.destination.remove(id)
    this.syncHash()
  }

  onEmpty = () => {
    this.destination.empty()
    this.syncHash()
  }
}
