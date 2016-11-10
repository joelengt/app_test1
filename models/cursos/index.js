var mongoose = require('mongoose')
var Schema = mongoose.Schema

var cursosSchema = new Schema({
	//order_number: {type: String},
	title: {type: String},
	cover: {},
	icon: {},
	slogan: {type: String},
	promedioRate: {type: Number},
	tags: [String],
	description: {type: String},
	materiales: { 
		texto: [{}],
		audioLibro: [{}],
		simulador: {}
	},
	colour: { type: String },
	reseñas: [String],
	createdAt: {type: Date, default: Date.now}
})

var Cursos = mongoose.model('cursos', cursosSchema)

module.exports = Cursos