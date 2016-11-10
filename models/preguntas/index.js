var mongoose = require('mongoose')
var Schema = mongoose.Schema

var preguntasSChema = new Schema({ 
	order: { type: String }, // Number orden position de la preguntas ejem #540
	type_categority: { type: String }, // Curso o Diplomado
	type_question: { type: String }, // select type question
	topic_title: { type: String },  // temas en lista del curso o diplomdo a seleccionar
	topic_id: { type: String }, // Identificador del tema trabajado
	question: { type: String },  // redacción de la pregunta
	answer: {}, // respuesta de la pregunta
	other_answers: [], // otras alternativas como respuestas 
	difficulty: { type: String }, // dificultad de la pregunta
	createdAt: { type: Date, default: Date.now }
})

var preguntas = mongoose.model('preguntas', preguntasSChema)

module.exports = preguntas
