var Township = require('township-client')
var qs = require('querystring')
var nets = require('nets')
var xtend = require('xtend')

module.exports = API

function API (opts) {
  if (!(this instanceof API)) return new API(opts)
  if (!opts) opts = {}
  var server = opts.server || 'https://datproject.org'
  var api = server + '/api/v1'
  var township = Township(xtend(opts, {
    server: api // used over opts.server
  }))
  return {
    login: township.login.bind(township),
    logout: township.logout.bind(township),
    register: township.register.bind(township),
    whoami: township.getLogin.bind(township),
    secureRequest: township.secureRequest.bind(township),
    dats: rest('/dats'),
    users: xtend(rest('/users'), {
      resetPassword: function(input, cb) {
        nets({method: 'POST', uri: api + '/password-reset', body: input, json: true}, cb)
      },
      resetPasswordConfirmation: function(input, cb) {
        nets({method: 'POST', uri: api + '/password-reset-confirm', body: input, json: true}, cb)
      }
    })
  }

  function rest (path) {
    var defaults = {
      uri: api + path,
      json: true
    }
    return {
      get: function (input, cb) {
        var params = qs.stringify(input)
        var opts = Object.assign({}, defaults)
        opts.uri = defaults.uri + '?' + params
        opts.method = 'GET'
        township.secureRequest(opts, cb)
      },
      create: function (input, cb) {
        var opts = Object.assign({}, defaults)
        opts.body = input
        opts.method = 'POST'
        township.secureRequest(opts, cb)
      },
      update: function (input, cb) {
        if (!input.id) throw new Error('id required')
        var opts = Object.assign({}, defaults)
        opts.body = input
        opts.method = 'PUT'
        township.secureRequest(opts, cb)
      },
      delete: function (input, cb) {
        if (!input.id) throw new Error('id required')
        var opts = Object.assign({}, defaults)
        opts.body = input
        opts.method = 'DELETE'
        township.secureRequest(opts, cb)
      }
    }
  }
}
