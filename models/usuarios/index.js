var mongoose = require('mongoose')
var Schema = mongoose.Schema

var usuariosSchema = new Schema({
	provider_id: { type: String },
	provider: 	{ type: String },
	token: 		{ type: String },
	first_name: { type: String },
	last_name: 	{ type: String },
	name: 		{ type: String },
	photo: 		{},
	email: 		{ type: String },
	nickname: 	{ type: String },
	age: 		{ type: String },
	genero: 	{ type: String },
	categoria: 	{ type: String },
	grado: 		{ type: String },
	grado_next: { type: String },
	lugar: 		{ type: String },
	address: 	{ type: String },
	phone:      { type: String },
	social_facebook:  { type: String },
	social_twitter:   { type: String },
	social_instagram: { type: String },
	news: 			  { type: String },
	access: 		  { type: String },
	notas_lecciones:  {
		cursos: [{
			type_categority: { type: String },
			curso_id: 		 { type: String },
			nivel: 			 { type: String },
			leccion:  		 { type: Number },
			resultados: {
				respuestas_correctas: { type: String },
				puntaje_final: 		  { type: String },
				progreso: 			  { type: String },
				finalizado: 		  { type: Boolean }
			}
		}],
		diplomados: [{}]
	},
	createdAt: { type: Date, default: Date.now }
})

var Users = mongoose.model('usuarios', usuariosSchema)

module.exports = Users