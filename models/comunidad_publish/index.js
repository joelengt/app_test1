var mongoose = require('mongoose')
var Schema = mongoose.Schema

var comunidad_publishSchema = new Schema({
	form_publish_type:  { type: String },
	user_id: 			{ type: String },
	user_name: 			{ type: String }, // Nombre de usuario
	user_nick: 			{ type: String }, // Nick de usuario
	user_grado: 		{ type: String }, // Grado actual de usuario
	user_photo: 		{ type: String }, // path imagen avatar actual de usuario
	publish_type: 		{ type: String }, // preguntas o discucion
	publish_title: 		{ type: String }, // titulo de publicacion
	publish_content: 	{ type: String }, // contenido de publicacion
	publish_multimedia: {}, // contenido multimedia - imagenes
	publish_etiqueta: 	{}, // tageo con etiqueta, para futuras busquedas por temas
	number_likes: 		{ type: Number }, // Numero total de likes de la publicion
	number_comments: 	{ type: Number }, // Numero de comentarios de la publicacion
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
	status_color: { type: String },
	fecha_creacion: 	{ type: Date, default: Date.now } // Fecha de creación
})

var comunidad = mongoose.model('comunidad', comunidad_publishSchema)

module.exports = comunidad