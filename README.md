# dat-registry-client

API Registry Client for publishing dats

### Quick Example

```js
var Registry = require('dat-registry')

var registry = Registry()

registry.login({email: 'karissa', password: 'my passw0rd r0cks!'}, function () {
  registry.dats.create({
    name: 'animal-names',
    url: 'dat://378d23adf22df',
    title: 'Animal Names',
    description: 'I did a study on animals for a very important Nature study, here are the spreadsheets with raw animals in them.'
  }, function (err, resp, json) {
    if (err) throw err
    if (resp.statusCode === 400) console.error(data.message)
    console.log('Published successfully!')
    // Created a nickname for a dat at `https://datproject.org/karissa/animal-names`
  })
})
```

### API

#### `var registry = Registry([opts])`

  * `opts.server`: the server to query. Default is `https://datproject.org`

#### `registry.login(data, cb)`

Requires `data.email` and `data.password`.

#### `registry.register(data, cb)`

Requires `data.username`, `data.email`, and `data.password`.

#### `registry.logout(cb)`

Will callback with logout success or failure.

#### `var user = registry.whoami([opts])`

Returns user object with currently logged in user. See `township-client` for options.


### CRUD API

#### `registry.dats.create(data, cb)`

Must be logged in. Requires a unique `data.name` and unique `data.url`. Dat will be immediately available on the `/:username/:name`.

Accepts also any fields in a `dat.json` file.

#### `registry.dats.get([data], cb)`

Returns all dats that match the given (optional) querystrings.

#### `registry.dats.update(data, cb)`
#### `registry.dats.delete(data, cb)`
#### `registry.users.get([data], cb)`
#### `registry.users.create(data, cb)`
#### `registry.users.update(data, cb)`
#### `registry.users.delete(data, cb)`
