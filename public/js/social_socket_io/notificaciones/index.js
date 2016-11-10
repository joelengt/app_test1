console.log('Notifis')

var socket = io()

socket.on('notificaciones', function (content) {
	console.log('Notificaciones')
	console.log(content)

	var template = `<article style="border-bottom: 1px solid black;">
						<p> article_id: ${content.article_id} </p>
 						<p> tipo notificacion: ${content.article_type} </p>
						
						<div>
							<p> user_id que genero la acción: ${content.datos_user.user_id} </p>
							<p> user_name que genero la acción: ${content.datos_user.name} </p>
							<img src="${content.datos_user.photo.path}" width="80">
							
							<p> Hace: ${content.fecha_creacion} </p>
						</div>
					</article>`

	$('.Notification_content').prepend(template)	

})

var MyNotificaciones = document.querySelector('#user_room').value

socket.on('connect', function() {
   socket.emit('MyNotificaciones', MyNotificaciones)
})
