
var Comunidad_publish = require('../../../models/comunidad_publish')

function incrementVoteAnswer (content_like_by_answer, callback) {
  Comunidad_publish.findOne({ _id: content_like_by_answer.article_id }, function (err, articulo) {
    if (err) {
      return callback('Error: ' + err)

    } else {
      // Obteniendo comment_id
      var comment_id = Number(content_like_by_answer.comment_id)

      // Obteniendo el answer_id
      var answer_id = Number(content_like_by_answer.answer_id)

      var comment_position = Number(comment_id - 1)
      var comment = articulo.users_comments[comment_position]

      // Obteniendo a la respuesta por answer_id
      var answer_position = Number(answer_id - 1)
      var answer = articulo.users_comments[comment_position].answers[answer_position]

      // Arreglo de todos los usuarios que le dieron like al answer
      var usuarios_liked = []
      usuarios_liked = answer.users_liked

      // Buscando si el id del usuario se encuentra registrado como liked the este comment
      var encontrado = false
      var encontrado_position

      for(var i = 0; i <= usuarios_liked.length - 1; i ++) {
        var element = usuarios_liked[i]
        // filtrando por el id de usuario
        if(element.user_id === content_like_by_answer.user_id) {
          encontrado = true
          encontrado_position = i
          //console.log('Usuario unliked encontrado en la posicion: ' + i)
          //console.log('Usuario id: ' + element.user_id)
          //console.log('Usuario Name: ' + element.user_name) 
          break
        }
      }

      if(encontrado === true) {
        //console.log('encontrado?: ' + encontrado)
        // Encontrado, ya tiene like -> contador -1
        articulo.users_comments[comment_position].answers[answer_position].counter_likes = articulo.users_comments[comment_position].answers[answer_position].counter_likes - 1
        articulo.users_comments[comment_position].answers[answer_position].status_color = 'gray'
        // Quitando de la lista al usuario unliked
        //console.log('Usuario unliked a sacar: ' + encontrado_position)
        articulo.users_comments[comment_position].answers[answer_position].users_liked.splice(encontrado_position,1)

      } else {
        //console.log('encontrado?: ' + encontrado)
        // No Encontrado, LIke -> contador +1
        articulo.users_comments[comment_position].answers[answer_position].counter_likes = articulo.users_comments[comment_position].answers[answer_position].counter_likes + 1
        articulo.users_comments[comment_position].answers[answer_position].status_color = 'blue'
        
        // Agregando a la lista al usuario liked
        articulo.users_comments[comment_position].answers[answer_position].users_liked.push({
          user_id: content_like_by_answer.user_id,
          user_name: content_like_by_answer.user_name
        })
      }
      
      // Guardando comment 
      articulo.save((err) => {
        if (err) {
          return callback(err)
        }
        articulo.users_comments[comment_position].answers[answer_position].status = encontrado

        for (var m =  articulo.users_comments[comment_position].answers.length - 1; m >= 0; m--) {
          var new_el = articulo.users_comments[comment_position].answers[m]
        } 
        articulo.users_comments[comment_position].answers[answer_position].comment_id = comment_id
        articulo.users_comments[comment_position].answers[answer_position].answer_id = answer_id
        
        callback(null, articulo.users_comments[comment_position].answers[answer_position])
      
      })

    }
  })
}

module.exports = incrementVoteAnswer

