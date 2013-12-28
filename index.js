module.exports = function () {
  var ctx = this

  var stack = []

  listener.use = function (hostname, fn) {
    if (typeof hostname === 'function') {
      stack.push([null, hostname, null])
    } else {
      // i'm not sure what this does - taken from connect
      var regexp = new RegExp('^' + hostname.replace(/[^*\w]/g, '\\$&').replace(/[*]/g, '(?:.*?)')  + '$', 'i');
      stack.push([regexp, fn, hostname])
    }

    return listener
  }

  return listener

  function listener(req, res) {
    var host = req.headers.host
    host = host ? host.split(':')[0] : false

    var match
    for (var i = 0; i < stack.length; i++) {
      match = stack[i]
      if (match[0] === null || (host && match[0].test(host)))
        return match[1].call(ctx, req, res)
    }

    throw new Error('no matched functions. you did something wrong!')
  }
}