var mongoose = require('mongoose')
var Schema = mongoose.Schema

var chatRoomSchema = new Schema({
	messages: [{
		user_id:   { type: String },
		message:   { type: String },
		message_multi_data: {},
		data_send: { type: Date, default: Date.now }
	}],
	dateCreateRoom: { type: Date, default: Date.now }
})

var chatContentRoom = mongoose.model('chatContentRoom', chatRoomSchema)

module.exports = chatContentRoom
