console.log('Saludoss!!')

// Obteniendos datos de usuario desde el DOM
var user_data = {
	id: document.querySelector('#user_id').value,
	token_facebook: document.querySelector('#user_token_facebook').value,
	data_id: document.querySelector('#user_base_id').value
}

console.log('Datos del usuario: ')
console.log(user_data)

$.ajax({
	type: 'get',
	url: `https://graph.facebook.com/v2.6/${user_data.id}/friends?access_token=${user_data.token_facebook}`,
	success: function (result) {
		console.log('Resultado de la URL')
		console.log(result.data)
		
		// Recorriendo el array
		for(var i = 0; i <= result.data.length - 1; i++) {
			var friend = result.data[i]
			
			// Obteniendo imagen de perfil de facebook
			var template_user = `<div>
									<p>facebook_id_provider: ${friend.id}</p>
									<img src="https://graph.facebook.com/${friend.id}/picture?type=large" width="80"/>
									<h3><a href="https://www.facebook.com/${friend.id}" target="_blank">${friend.name}</a></h3>
									<form action="/plataforma/comunidad/find-friends/by-facebook/add/${friend.id}" method="post">
										<button>Agregara Amigo</button>
									</form>
								</div>`

			// Pegando la data en el DOM
			var $box_friend_list = document.querySelector('#List_friends_facebook')
			$box_friend_list.innerHTML += template_user
		}

	
	}
})

