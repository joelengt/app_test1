var mongoose = require('mongoose')
var Schema = mongoose.Schema

var notas_commentSchema = new Schema({
	user_id:            { type: String },
	type_categority:    { type: String },
	topic_id:           { type: String },
	//texto_material_id:  { type: String },
	nota_texto_id:      { type: String },
	content_comment:    { type: String },
	fecha_creacion:     { type: Date, default: Date.now }
})

var notas_comment = mongoose.model('notas', notas_commentSchema)

module.exports = notas_comment
