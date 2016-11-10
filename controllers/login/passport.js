var User = require('../../models/usuarios')
var config = require('../../config')

// var TwitterStrategy = require('passport-twitter').Strategy
var FacebookStrategy = require('passport-facebook').Strategy

var register = function (res, passport) {

	passport.serializeUser(function(user, done) {
		done(null, user)
	})

	passport.deserializeUser(function(id, done) {
		User.findById(id, function(err, user) {
            done(err, user)
        })
	})

	// Configuración del autenticado con Facebook
	passport.use(new FacebookStrategy({
		clientID		: config.facebook.id,
		clientSecret	: config.facebook.secret,
		callbackURL	    : '/auth/facebook/callback', 
		profileFields   : ['id', 'displayName','name', /*'photos'*/, 'email', 'locale', 'age_range', 'gender', 'picture.type(large)', 'profileUrl', 'friends']
	}, function(accessToken, refreshToken, profile, done) {

		process.nextTick(function () {

			User.findOne({provider_id: profile.id}, function (err, user) {

				if(user){
					console.log('Usuario existente, acceso directo a la plataforma')
					return done(null, user)
				}else {
					
					console.log('Usuario NO existente, te estamos registrando')

					// Creando al nuevo usuario
					var user = new User({
						provider_id	  : profile.id,
						provider	  : profile.provider,
						token         : accessToken,
						first_name    : profile._json.first_name,
						last_name     : profile._json.last_name,
						name		  : profile._json.first_name + ' ' + profile._json.last_name,
						photo         : { path: profile.photos ? profile.photos[0].value : './images/faces/unknown-user-pic.png' },
						// photo		  : profile.photos[0].value,
						email         : profile.emails[0].value,
						age           : '',
						genero        : '',
						categoria     : '',
						grado         : '',
						grado_next    : '',
						lugar         : profile._json.locale || 'es_Peru',
						phone		  : '999999999',
						address 	  : profile._json.locale + '- Peru' || 'OnePlace - es_Peru',
						social_facebook :  profile.profileUrl,
						social_twitter  :  '',
						social_instagram:  '',
						news            :  'si',
						access			:  'free',
						amigos_registrados: profile._json.friends.data
					})

					var new_nick = ''

					for(var i = 0; i <= user.first_name.length - 1 ; i++) {
						var caracter = user.first_name[i]

						if(caracter === ' ') {
							new_nick+= '_'
							
						} else {
							new_nick+= caracter
						}

					}

					user.nickname = new_nick
					
					user.save(function(err) {
						if(err) throw err
						// res.redirect('/plataforma/start')
						console.log('usuario registrado')
						// console.log(res)
						done(null, user)
					})

					// Si no exite
					// return done(null, false)
				}
			})

		})
	}))
}

module.exports = register
