var request = require('client-request')
var qs = require('querystring')

// Build
function Client (options, provider_id, user_token) {
  this.options = options || {}
  this.endpoint = this.options.endpoint || `https://graph.facebook.com/v2.6/${provider_id}/invitable_friends?access_token=${user_token}`
}

Client.prototype._request = function (path, method, params, callback) {
  var uri = this.endpoint + path

  if (params) {
    uri = uri + '?' + qs.encode(params)
  }

  request({
    uri: uri,
    method: method,
    json: true
  }, function (err, res, body) {
    if (err) return callback(err)

    if (res.statusCode !== 200) return callback(new Error('An error ocurred in the request'))
    
    console.log(body)

    callback(null, body)
  })
}

Client.prototype.shows = function (callback) {
  this._request('/shows', 'GET', null, callback)
}

Client.prototype.search = function (show, callback) {
  this._request('/search/shows', 'GET', { q: show }, callback)
}

module.exports = Client
