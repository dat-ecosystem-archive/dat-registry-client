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
  var township = Township({
    server: api
  })
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
    var data = {
      uri: api + path,
      json: true
    }
    return {
      get: function (input, cb) {
        var params = qs.stringify(input)
        data.uri += '?' + params
        nets.get(data, cb)
      },
      create: function (input, cb) {
        data.body = input
        nets.post(data, cb)
      },
      update: function (input, cb) {
        if (!input.id) throw new Error('id required')
        data.body = input
        nets.put(data, cb)
      },
      delete: function (input, cb) {
        if (!input.id) throw new Error('id required')
        data.body = input
        nets.del(data, cb)
      }
    }
  }
}
