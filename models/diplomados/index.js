var mongoose = require('mongoose')
var Schema = mongoose.Schema

var diplomadosSchema = new Schema({
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
		simulador: [{}] 
	},
	reseñas: [String],
	createdAt: {type: Date, default: Date.now}
})

var Diplomados = mongoose.model('diplomados', diplomadosSchema)

module.exports = Diplomados
