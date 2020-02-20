
const NODE_TYPE_ELEMENT = 1
const NODE_TYPE_TEXT_NODE = 2
const NODE_TYPE_COMPONENT = 3

const OBSERVABLE_TYPE_OBJECT = 1
const OBSERVABLE_TYPE_VALUE = 2
const OBSERVABLE_TYPE_COLLECTION = 3

const PROCESS_CHUNK_TIME = 60

const nextTickSetTimeout = (func) => setTimeout(func, 0)
const nextTickRequestAnimationFrame = (func) => window.requestAnimationFrame(func)
const nextTick = window.requestAnimationFrame ? nextTickRequestAnimationFrame : nextTickSetTimeout

// return processed with handler items Promise
function process(items, handler) {
  let last = Date.now()
  const result = []

  return new Promise((resolve, reject) => {
    const processItem = (left) => {
      for (let i = left; i < items.length; ++i) {
        result.push(handler(items[i]))

        if ((Date.now() - last) > PROCESS_CHUNK_TIME) {
          last = Date.now()
          nextTick(() => processItem(i + 1))
          break
        }
      }

      if (result.length === items.length) resolve(result)
    }

    processItem(0)
  })
}
