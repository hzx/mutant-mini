
function get(url, success, fail) {
  const request = new XMLHttpRequest()

  request.onreadystatechange = function() {
    if (request.readyState === 4) { // 4 - complete
      // Everything is good, the response was received.
      if (request.status === 200) {
        success(request.responseText)
      } else {
        fail(request.responseText, request.status)
      }
    }
    // } else { // Not ready yet
  }

  request.open('GET', url, true)
  request.setRequestHeader("X-Requested-With", "XMLHttpRequest")
  request.send(null)
}
