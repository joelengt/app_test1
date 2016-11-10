
var Comunidad_publish_muro_friend = require('../../models/publish_muro_to_friend')

function incrementVote (content_like_event, callback) {
  Comunidad_publish_muro_friend.findOne({ _id: content_like_event.article_id }, function (err, articulo) {
    if (err) {
      return callback('Error: ' + err)

    } else {
      // Arreglo de todos los usuarios que le dieron like al articulo
      var usuarios_liked = []
      usuarios_liked = articulo.users_liked

      // Buscando si el id del usuario se encuentra registrado como liked the este articulo
      var encontrado = false
      var encontrado_position

      for(var i = 0; i <= usuarios_liked.length - 1; i ++) {
        var element = usuarios_liked[i]
        // filtrando por el id de usuario
        if(element.user_id === content_like_event.user_id) {
          encontrado = true
          encontrado_position = i
          //console.log('Usuario unliked encontrado en la posicion: ' + i)
          //console.log('Usuario id: ' + element.user_id)
          //console.log('Usuario Name: ' + element.user_name)    
          break
        }
      }

      if(encontrado === true) {
        // Encontrado, ya tiene like -> contador -1
        articulo.number_likes = articulo.number_likes - 1
        articulo.status_color = 'gray'

        // Quitando de la lista al usuario unliked
        //console.log('Usuario unliked a sacar: ' + encontrado_position)
        articulo.users_liked.splice(encontrado_position,1)

      } else {
        // No Encontrado, LIke -> contador +1
        articulo.number_likes = articulo.number_likes + 1
        articulo.status_color = 'blue'

        // Agregando a la lista al usuario liked
        articulo.users_liked.push({
          user_id: content_like_event.user_id,
          user_name: content_like_event.user_name
        })
      }
      
      articulo.save((err) => {
        if (err) {
          return callback(err)
        }

        articulo.status = encontrado
        callback(null, articulo)
      
      })

    }
  })
}

module.exports = incrementVote
