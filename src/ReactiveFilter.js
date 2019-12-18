
class ReactiveFilter {
  // groups - [{element, collection, filter, render}...]
  constructor(collection, groups) {
    this.collection = collection
    this.groups = groups
  }

  enter() {
    this.collection.oSet.subscribe(this.onSet)
    this.collection.oInsert.subscribe(this.onInsert)
    this.collection.oAppend.subscribe(this.onAppend)
    this.collection.oInsertBefore.subscribe(this.onInsertBefore)
    this.collection.oMove.subscribe(this.onMove)
    this.collection.oRemove.subscribe(this.onRemove)
    this.collection.oEmpty.subscribe(this.onEmpty)
    this.collection.oItemUpdate.subscribe(this.onItemUpdate)
  }

  exit() {
    this.collection.oSet.unsubscribe(this.onSet)
    this.collection.oInsert.unsubscribe(this.onInsert)
    this.collection.oAppend.unsubscribe(this.onAppend)
    this.collection.oInsertBefore.unsubscribe(this.onInsertBefore)
    this.collection.oMove.unsubscribe(this.onMove)
    this.collection.oRemove.unsubscribe(this.onRemove)
    this.collection.oEmpty.unsubscribe(this.onEmpty)
    this.collection.oItemUpdate.unsubscribe(this.onItemUpdate)
  }

  renderCollection() {
    this.groups.forEach(group => {
      group.collection.empty()
      group.element.children.empty()

      // TODO(dem): add to array then set group collection
      this.collection.forEach(item => {
        if (group.filter(item)) {
          group.collection.append(item)
          group.element.children.append(this.renderItem(item, group.render))
        }
      })
    })
  }

  renderItem(item, render) {
    const vnode = render(item)
    setVirtualNodeId(vnode, item.getId())
    return vnode
  }

  onSet = () => {
    this.renderCollection()
  }

  onInsert = (item) => {
    const group = this.findObjectGroupByFilter(item)
    if (!group) return

    group.collection.insert(item)
    group.element.children.insert(this.renderItem(item, group.render))
  }

  onAppend = (item) => {
    const group = this.findObjectGroupByFilter(item)
    if (!group) return

    group.collection.append(item)
    group.element.children.append(this.renderItem(item, group.render))
  }

  onInsertBefore = ({item, beforeId}) => {
    const group = this.findObjectGroupByFilter(item)
    if (!group) return

    group.collection.insertBefore(item, beforeId)
    group.element.children.insertBefore(this.renderItem(item, group.render), beforeId)
  }

  onMove = ({id, beforeId}) => {
    const item = this.collection.get(id)
    if (!item) throw new Error(`onMove id="${id}" not found`)

    const groupByFilter = this.findObjectGroupByFilter(item)
    const group = this.findObjectGroup(id)
    const beforeGroup = beforeId ? this.findObjectGroup(beforeId) : null

    // item doesn't belong to any group
    if (!groupByFilter) {
      if (!group) return // item isn't in any group
      else { // item in group - remove it
        group.collection.remove(id)
        group.element.children.remove(id)
        return
      }
    }

    // error moving item in different groups
    if (beforeGroup && groupByFilter !== beforeGroup) throw new Error(`onMove id="${id}", beforeId="${id}" belong to different groups`)

    if (group && group !== groupByFilter) { // move between groups
      this.moveItemBetweenGroups(item, beforeId, group, groupByFilter)
    } else { // move in group or move inside of group
      groupByFilter.collection.move(id, beforeId)
      groupByFilter.element.children.move(id, beforeId)
    }
  }

  onRemove = (id) => {
    const group = this.findObjectGroup(id)
    if (!group) return

    group.collection.remove(id)
    group.element.children.remove(id)
  }

  onEmpty = () => {
    this.groups.forEach(group => {
      group.collection.empty()
      group.element.children.empty()
    })
  }

  onItemUpdate = (item) => {
    // move item between groups
    const id = item.getId()
    const group = this.findObjectGroup(id)
    const groupByFilter = this.findObjectGroupByFilter(item)

    // item doesn't delong to any group
    if (!groupByFilter) {
      if (!group) return // item isn't in any group
      else { // item in group - remove out of group
        group.collection.remove(id)
        group.element.children.remove(id)
      }
      return
    }

    // item belongs to groupByFilter, but isn't in any group, add in group
    if (!group) {
      const next = this.findGroupNextItem(id, groupByFilter)
      const beforeId = next ? next.getId() : null

      groupByFilter.collection.insertBefore(item, beforeId)
      const vnode = this.renderItem(item, groupByFilter.render)
      groupByFilter.element.children.insertBefore(vnode, beforeId)
    } else {
      // item in group after update belongs to other groupByFilter,
      // move between groups
      if (group !== groupByFilter) {
        const next = this.findGroupNextItem(id, groupByFilter)
        const beforeId = next ? next.getId() : null

        this.moveItemBetweenGroups(item, beforeId, group, groupByFilter)
      } // item in group, no need to move it
    }
  }

  moveItemBetweenGroups(item, beforeId, from, to) {
    const id = item.getId()

    from.collection.remove(id)
    const vnode = from.element.children.remove(id)

    to.collection.insertBefore(item, beforeId)
    to.element.children.insertBefore(vnode, beforeId)
  }

  findObjectGroupByFilter(item) {
    return this.groups.find(group => group.filter(item))
  }

  findObjectGroup(id) {
    return this.groups.find(group => {
      const item = group.collection.getItems().find(item => item.getId() === id)
      return item !== undefined
    })
  }

  findGroupNextItem(id, group) {
    const items = this.collection.getItems()
    const index = Collection.getIndex(items, id)
    if (index === -1) throw new Error(`findGroupNextItem id="${id}" not found`)

    let item
    for (let i = index + 1; i < items.length; ++i) {
      item = items[i]
      if (group.filter(item)) return item
    }

    return null
  }

  findNextItem(id, exclude) {
    const group = this.findObjectGroup(id)
    if (!group) return null

    let item = this.findGroupNextItem(id, group)
    if (item && item.getId() === exclude) item = this.findGroupNextItem(exclude, group)
    return item
  }
}
