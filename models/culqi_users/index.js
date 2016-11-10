var mongoose = require('mongoose')
var Schema = mongoose.Schema

var user_buySchema = new Schema({
	user_data: {
		id: { type: String },
		service: { type: String }
	},
	culqi_response: {
		mensaje_respuesta_usuario:  { type: String },
		monto: 					    { type: String },
		mensaje_respuesta: 		    { type: String },
		ticket: 				    { type: String },
		codigo_respuesta: 		    { type: String },
		numero_pedido: 			    { type: String },
		codigo_comercio: 		    { type: String },
		informacion_venta: 		    { type: String }
	}
})

var model_sales = mongoose.model('model_sales', user_buySchema)

module.exports = model_sales
