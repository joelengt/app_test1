var mongoose = require('mongoose')
var Schema = mongoose.Schema

var amigosSchema = new Schema({
	user_id: { type: String },
	user_provider_id: { type: String },
	amigos: [{
		user_id: { type: String },
		user_provider_id: { type: String }
	}]
})

var friends = mongoose.model('friends', amigosSchema)

module.exports = friends
