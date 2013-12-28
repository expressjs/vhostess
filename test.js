
var assert = require('assert')

var hostess = require('./')

function req(host) {
  return {
    headers: {
      host: arguments.length ? host : '127.0.0.1:3000'
    }
  }
}

describe('Virtual Hostess', function () {
  describe('should route by host', function () {
    it('1', function (done) {
      hostess()
      .use('*.example.com', function () {
        throw new Error('boom')
      })
      .use('example.com', function () {
        done()
      })
      .use(function () {
        throw new Error('boom')
      })(req('example.com'))
    })

    it('2', function (done) {
      hostess()
      .use('*.example.com', function () {
        done()
      })
      .use('example.com', function () {
        throw new Error('boom')
      })
      .use(function () {
        throw new Error('boom')
      })(req('asdf.example.com'))
    })

    it('3', function (done) {
      hostess()
      .use('*.example.com', function () {
        done()
      })
      .use('example.com', function () {
        throw new Error('boom')
      })
      .use(function () {
        throw new Error('boom')
      })(req('asdf.asdfasdf.example.com:123123123'))
    })

    it('4', function (done) {
      hostess()
      .use(function () {
        done()
      })(req('asdf.asdfasdf.example.com'))
    })
  })

  describe('when no default is set', function () {
    it('should throw', function () {
      assert.throws(function () {
        hostess()(req('example.com'))
      })
    })
  })

  describe('when no host is set', function () {
    it('should default to hostless', function (done) {
      hostess()
      .use('*.example.com', function () {
        throw new Error('boom')
      })
      .use('example.com', function () {
        throw new Error('boom')
      })
      .use('*', function () {
        throw new Error('boom')
      })
      .use(function () {
        done()
      })(req(''))
    })
  })
})