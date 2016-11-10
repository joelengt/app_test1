var mongoose = require('mongoose')
var Schema = mongoose.Schema

var send_to_muro_ProgressSchema = new Schema({
	form_publish_type:   { type: String },
	user_id:        { type: String },
	user_name: 		{ type: String },
	user_nick: 		{ type: String },
	user_grado: 	{ type: String },
	user_photo: 	{ type: String },
	publish_detalles: 	{},
	publish_icon_topic: {},
	publish_etiqueta: 	{},
	number_likes: { type: Number },
	number_comments: { type: Number },
	users_liked: 		[{}], // Info de Usuarios que le dieron like al articulo
	users_comments:     [{
			article_id: { type: String }, 
			comment_id: { type: String },
			user_id: 	{ type: String },
			user_name: 	{ type: String },
			user_nick: 	{ type: String },
			user_photo: { type: String },
			user_grado: { type: String },
			comment: 	{ type: String },
			answers: 	[{
				article_id: { type: String },
				comment_id: { type: String },
				answer_id:  { type: String },
				user_id:    { type: String },
				user_name:  { type: String },
				user_nick:  { type: String },
				user_photo: { type: String },
				user_grado: { type: String },
				answer:     { type: String },
				users_liked: [{}],
				status_color: { type: String },
				counter_likes: { type: Number },
				fecha_creacion: { type: Date, default: Date.now }
			}],
			status_color: { type: String },
			users_liked: [{}],
			counter_likes: { type: Number },
			counter_answers: { type: Number },
			fecha_creacion:  { type: Date, default: Date.now }
	}],
	status_color:   { type: String },
	fecha_creacion: 	{  type: Date, default: Date.now }
})

var muro_progress = mongoose.model('muro_progress', send_to_muro_ProgressSchema)

module.exports = muro_progress
