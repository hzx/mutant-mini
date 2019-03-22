
e(name, attrs, events, childs)
element -> Element
name: string
attrs: array of pairs attrName, attrValue
events: array of pairs eventName, eventHandler
childs: array of Element | TextNode | Component

div(attrs, events, childs)
span(attrs, events, childs)

c(ComponentType, ...params)
component -> ComponentType(...params)

rc(obj, render, deps)
reactiveComponent -> ReactiveComponent
obj: ObservableValue | ObservableObject
render: function return Element | TextNode | Component
deps: array of fieldName, array of fieldNames

rm(name, attrs, events, collection, render)
reactiveElementMap -> ReactiveElementMap
collection: ObservableCollection
render: function return Element | TextNode | Component

t(value)
text -> TextNode
value: ObservableValue

rt(value)
rtext -> ReactiveTextNode
value: ObservableValue

Component

render(vnode, parentNode)


toObservable(obj)
toObservableValue(value)
toObservableObject(obj)
toObservableCollection(arr)
