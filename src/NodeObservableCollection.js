
class NodeObservableCollection extends NodeCollection {
  constructor(parent, collection, render) {
    super([])
    this.parent = parent
    this.collection = collection
    this.render = render
    this.renderCollection()
  }

  renderCollection() {
    this.set(this.collection.map(item => this.render(item)).filter(item => item))
  }

  enter() {
    super.enter()

    this.collection.oSet.subscribe(this.onSet)
    this.collection.oInsert.subscribe(this.onInsert)
    this.collection.oAppend.subscribe(this.onAppend)
    this.collection.oInsertBefore.subscribe(this.onInsertBefore)
    this.collection.oMove.subscribe(this.onMove)
    this.collection.oRemove.subscribe(this.onRemove)
    this.collection.oEmpty.subscribe(this.onEmpty)
  }

  exit() {
    super.exit()

    this.collection.oSet.unsubscribe(this.onSet)
    this.collection.oInsert.unsubscribe(this.onInsert)
    this.collection.oAppend.unsubscribe(this.onAppend)
    this.collection.oInsertBefore.unsubscribe(this.onInsertBefore)
    this.collection.oMove.unsubscribe(this.onMove)
    this.collection.oRemove.unsubscribe(this.onRemove)
    this.collection.oEmpty.unsubscribe(this.onEmpty)
  }

  onSet() => {
    super.set(items)
  }

  onInsert(item) => {
    super.insert(item)
  }

  onAppend(item) => {
    super.append(item)
  }

  onInsertBefore({item, beforeId}) => {
    super.insertBefore(item, beforeId)
  }

  onMove({id, beforeId}) => {
    super.move(id, beforeId)
  }

  onRemove(id) => {
    super.remove(id)
  }

  onEmpty() => {
    super.empty()
  }
}
