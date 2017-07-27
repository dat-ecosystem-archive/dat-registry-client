var test = require('tape')
var http = require('http')
var Client = require('./')
var express = require('express')
var Api = require('dat-registry-api')
var rimraf = require('rimraf')

var testConfig = {
  data: 'testdata',
  admins: [
    'admin', 'pam', 'willywonka'
  ],
  township: {
    secret: 'very very not secret',
    db: 'township.db'
  },
  email: {
    fromEmail: 'hi@example.com'
  },
  db: {
    dialect: 'sqlite3',
    connection: {
      filename: 'sqlite.db'
    },
    useNullAsDefault: true
  },
  whitelist: false,
  archiver: {
    dir: 'archiver',
    verifyConnection: false,
    timeout: 3000
  }
}

var batman = {
  username: 'batman',
  password: 'brucecool49',
  email: 'darkknight@hotmail.com'
}

test('works with hostname:port', function (t) {
  testServer(testConfig, function (finish) {
    var config = {server: 'localhost:8891'}
    var registry = Client(config)
    registry.register(batman, function (err, resp) {
      if (err) {
        t.ifErr(err, 'should not error')
        return finish(t)
      }
      t.ok(resp.key, 'got key')
      t.ok(resp.token, 'got token')
      finish(t)
    })
  })
})

function testServer (config, cb) {
  var api = Api(config)
  var router = express()

  router.post('/users', api.users.post)
  router.get('/users', api.users.get)
  router.put('/users', api.users.put)
  router.put('/users/suspend', api.users.suspend)
  router.delete('/users', api.users.delete)

  router.get('/dats', api.dats.get)
  router.post('/dats', api.dats.post)
  router.put('/dats', api.dats.put)
  router.delete('/dats', api.dats.delete)

  router.post('/register', api.auth.register)
  router.post('/login', api.auth.login)
  router.post('/password-reset', api.auth.passwordReset)
  router.post('/password-reset-confirm', api.auth.passwordResetConfirm)
  
  var server = http.createServer(function (req, res) {
    console.log('test server', req.method, req.path)
    router(req, res)
  })
  
  server.listen(8891, function (err) {
    if (err) throw err
    cb(finish)
  })
  
  function finish (t) {
    server.close()
    server.on('close', function () {
      api.close(function () {
        rimraf.sync(testConfig.data)
        t.end()
      })
    })
  }
}