
// Data obtenida de la url dinamica
var curso_id = '57427fba367ef3340431948c'
var texto = '2'

// Obteniendo JSON del texto
$.ajax({
	type: 'GET',
	url: `/plataforma/cursos/${curso_id}/textos/${texto}`,
	success: function (data) {

		// Obteniendo data del usuario
		var user = data.user
		//console.log(user)

		// Obteniendo amigos del usuario para invitar
		$.ajax({
			type:'GET',
			url:`https://graph.facebook.com/v2.6/${user.provider_id}/invitable_friends?access_token=${user.token}`,
			success: function (invite_friends){
				// Extra Filtro de Invitación
				
				var Object_friends = invite_friends
				var arr_friends = Object_friends.data

				// Arreglo con lista de amigos
				for(var i = 0; i <= arr_friends.length - 1; i++) {
					var friend_element = arr_friends[i]

					var friend =  {
						name: friend_element.name,
						avatar: friend_element.picture.data.url
					}

					var friend_url = friend.avatar

					var friend_url_refactor = friend_url.replace('https://scontent.xx.fbcdn.net/v/t1.0-1/p50x50/','')

					var limite = []
					var cant_ = 0

					for(var i = 0; i <= friend_url_refactor.length - 1; i++) {

						var el = friend_url_refactor[i]
													
						if(el === '_') {
							cant_ += 1

							if(cant_ <= 2){
								limite.push(i)

							} else {
								break

								}
							}
					}

					console.log(limite)

					// Obteniendo la palabra completa
					var limite_a = limite[0] + 1
					var limite_b = limite[1] - 1
					var friend_id_new = ''

					for (var h = limite_a; h <= limite_b; h++) {
						friend_id_new += friend_url_refactor[h]
					}

					// Obteniendo id photo de amigo
					console.log(friend_id_new)

					// Buscando amigo desde la url de facebook

					$.ajax({
						type: 'get',
						url: 'https://www.facebook.com/1785211491706675',
						success: function (url_profile_user){
							console.log(url_profile_user)
						}
					})
				}
			}
		})	
	}
})


// App Id SDK Facebook
window.fbAsyncInit = function() {
  FB.init({
    appId      : '894467093989200',
    xfbml      : true,
    version    : 'v2.5'
  })
}

btn_send.addEventListener('click', FacebookInviteFriends)

function FacebookInviteFriends(){
 
  //Send

  FB.ui({
  	method: 'send',
  	to: '1117756591610111',
  	link: 'http://www.nytimes.com/interactive/2015/04/15/travel/europe-favorite-streets.html'
  })
}

page()
