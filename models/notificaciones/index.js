var mongoose = require('mongoose')
var Schema = mongoose.Schema

var notificacioneSChema = new Schema({
	article_id:   { type: String },
	article_type: { type: String },
	datos_user:   {
		user_id:  { type: String }
	},
	fecha_creacion: { type: Date, default: Date.now }
})

var notificaciones = mongoose.model('notificaciones', notificacioneSChema)

module.exports = notificaciones
