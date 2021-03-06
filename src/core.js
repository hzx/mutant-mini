
function extends__(child, base) {
  const Tmp = new Function()
  Tmp.prototype = base.prototype
  child.prototype = new Tmp()
  child.prototype.constructor = child
  child.base = base.prototype
}

function arrayMap__(arr, func) {
  const a = new Array(arr.length)
  for (let i = 0; i < arr.length; ++i) {
    a[i] = func(arr[i], i, arr)
  }
  return a
}

function arrayForEach__(arr, func) {
  for (let i = 0; i < arr.length; ++i) {
    func(arr[i], i, arr)
  }
}

function arrayFilter__(arr, func) {
  const r = []
  arrayForEach__(arr, function(item, i) {
    if (func(item, i, arr)) r.push(item)
  })
  return r
}

function arrayReduce__(arr, func, initialValue) {
  let accum, first
  if (initialValue === undefined) {
    accum = arr.length > 0 ? arr[0] : null
    first = 1
  } else {
    accum = initialValue
    first = 0
  }
  for (let i = first; i < arr.length; ++i) {
    accum = func(accum, arr[i])
  }
  return accum
}
