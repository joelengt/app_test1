var mongoose = require('mongoose')
var Schema = mongoose.Schema

var notas_textosSchema = new Schema({
	user_id:            { type: String },
	type_categority:    { type: String },
	topic_id:           { type: String },
	//texto_material_id:  { type: String },
	texto_marcado:      { type: String },
	color:              { type: String },
	have_comment:       { type: Boolean },
	fecha_creacion:     { type: Date, default: Date.now }
})

var notas_textos = mongoose.model('notas_textos', notas_textosSchema)

module.exports = notas_textos
