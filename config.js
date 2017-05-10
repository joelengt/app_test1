var config = {
	twitter: {
		key: 'Q1RBf33B7AuZq1NpH7QMfTGe5',
		secret: 'XUFWmLaayDsL1UFo9mR4IeIiLc9FcpDMj54cJv4dI1S4EkOEa1'
	},
	//facebook:{
	//	id: '1671164283209493',
	//	secret: '7c9ed9f27ae311f680d4ca44326c0825'
	//},
	facebook:{
	 	id: '296050814163421',
	 	secret: '80cb690ad5aa5466a0ba67abb4626a14'
	},
	admin:{
		user : 'admin',
		pass : '12345678'
	},
	culqi:{
		key_api_dev: '5jaVROAEp51mE7Br8mdQ6dfVbEfhszNXQPB3GsI2Np4=',
		code_comercio_dev: 'vivPfq6XgLtM',
		key_api: 'zGdhpkAMeaG+lKcvj++e2me5b0YkhprNCCQIvLKinvs=',
		code_comercio: 'OgUFtt0jQKid'
	},
	mongodb:{
		local: 'mongodb://localhost/ascentperu',
		test : 'mongodb://ascent16:fernando123@ds021333.mlab.com:21333/test-ascent',
		mlab : 'mongodb://ascent16:fernando123@ds013981.mlab.com:13981/ascentperu'
	},
	cloudinary : {
		cloud_name: 'cromlu',
		api_key: '532668554832195',
		api_secret: 'PLstoVjJNoBiqPhNDGriHyVWVTc'
	},
	typeUser: {
		free : 'free', // Registrado en la base de datos y acceso a texto si comparte, sube de nivel
		acceso_libros: 'acceso_libros', // like fan page, invitar min 3 de 5 amigos sugeridos (filtro de si son policias de pnp, trabajo y otro)
		acceso_audiolibros: 'acceso_audiolibros', //S/10
		acceso_simulador: 'acceso_simulador', // S/10
		premium: 'premium', // Acceso a audiolibros y simulador S/15
		admin : 'admin' // Acceso Total a todo y panel de admin
	},
	pregunta: {
		categoria: {
			curso: 'curso',
			diplomado: 'diplomado'
		},
		tipos: {
			alternativa: 'alternativa',
			completar: 'completar',
			imagenes: 'imagenes',
			escribir: 'escribir'
		},
		dificultad: {
			muestra: 'muestra',
			basico: 'basico',
			intermedio: 'intermedio',
			avanzado: 'avanzado'
		}
	}
}

module.exports = config

