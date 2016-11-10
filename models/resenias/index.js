var mongoose = require('mongoose')
var Schema = mongoose.Schema

var reseniasSchema = new Schema ({
	type_categority : { type: String }, // curso o diplomado
	topic_id:         { type: String },  // Identificador de tema trabajado
	topic_title:      { type: String }, // titulo de tema escogido
	user_full_name:   { type: String }, // nombre completo del usuario
	user_avatar:      { type: String }, // avatar path del usuario
	user_grado:       { type: String },
	rate:             { type: Number }, // puntuación personal sobre el contenido
	comment:          { type: String }, // comentario personal sobre el contenido
	createdAt:        { type: Date, default: Date.now } // fecha de la creación
})

var resenias = mongoose.model('resenias', reseniasSchema)

module.exports = resenias
