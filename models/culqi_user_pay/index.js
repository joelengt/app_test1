var mongoose = require('mongoose')
var Schema = mongoose.Schema

var user_paid_infoSchema = new Schema({
	id_transaccion: 	{ type: String },
	ticket: 			{ type: String },
	correo_electronico: { type: String },
	numero_tarjeta: 	{ type: String },
	numero_pedido: 		{ type: String },
	pais_emisor: 		{ type: String },
	codigo_autorizacion: { type: String },
	nombre_emisor: 		 { type: String },
	marca: 				 { type: String },
	nombre_tarjeta_habiente:   { type: String },
	mensaje_respuesta_usuario: { type: String },
	mensaje_respuesta: 		   { type: String },
	codigo_respuesta: 		   { type: String },
	codigo_comercio: 		   { type: String },
	referencia_transaccion:    { type: String },
	apellido_tarjeta_habiente: { type: String }
})

var user_paid_process = mongoose.model('user_paid_process', user_paid_infoSchema) 

module.exports = user_paid_process