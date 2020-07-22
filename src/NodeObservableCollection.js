
class NodeObservableCollection extends NodeCollection {
  constructor(parent, collection, render, processChildren, beforeSetChildren, afterRerender) {
    super(parent, [])
    this.collection = collection
    this.renderItem = render
    this.processChildren = processChildren
    this.beforeSetChildren = beforeSetChildren
    this.afterRerender = afterRerender
    this.syncHash()
  }

  render() {
    return this.collection.map((item, i) => {
      const ritem = this.renderItem(item, i)
      setVirtualNodeId(ritem, getCollectionItemId(item))
      return ritem
    }).filter(item => item)
  }

  init() {
    this.setChildren(this.render())
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
    this.collection.oSetFilter.subscribe(this.onSetFilter)

    if (this.hash !== this.collection.hash) { // collection was changed
      this.init()
      if (this.afterRerender) this.afterRerender()
    }
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
    this.collection.oSetFilter.unsubscribe(this.onSetFilter)
  }

  setChildren(items) {
    if (this.beforeSetChildren) this.beforeSetChildren(this.parent)
    emptyNodes(this.parent)
    super.set(items)
    setChildren(this.parent, items, this.processChildren)
  }

  syncHash() {
    this.hash = this.collection.hash
  }

  onSet = () => {
    this.syncHash()
    this.init()
  }

  onInsert = (item) => {
    this.syncHash()
    const vnode = this.renderItem(item)
    setVirtualNodeId(vnode, getCollectionItemId(item))
    if (vnode) this.insert(vnode)
  }

  onAppend = (item) => {
    this.syncHash()
    const vnode = this.renderItem(item)
    setVirtualNodeId(vnode, getCollectionItemId(item))
    if (vnode) this.append(vnode)
  }

  onInsertBefore = ({item, beforeId}) => {
    this.syncHash()
    const vnode = this.renderItem(item)
    setVirtualNodeId(vnode, getCollectionItemId(item))
    if (vnode) this.insertBefore(vnode, beforeId)
  }

  onMove = ({id, beforeId}) => {
    this.syncHash()
    this.move(id, beforeId)
  }

  onRemove = (id) => {
    this.syncHash()
    this.remove(id)
  }

  onEmpty = () => {
    this.syncHash()
    this.empty()
  }

  onSetFilter = () => {
    this.syncHash()

    let item, filteredItem
    const filtered = []

    if (!this.collection.filtered) {
      this.filtered = null
      for (let i = 0; i < this.items.length; ++i) {
        item = this.items[i]
        filterNode(item, true)
      }
      return
    }

    for (let i = 0, f = 0; i < this.items.length; ++i) {
      item = this.items[i]
      if (f < this.collection.filtered.length) {
        filteredItem = this.collection.filtered[f]
        if (getCollectionItemId(item) === getCollectionItemId(filteredItem)) {
          ++f
          filtered.push(item)
          filterNode(item, true)
        } else {
          filterNode(item, false)
        }
      } else {
        filterNode(item, false)
      }
    }
    this.filtered = filtered
  }
}
