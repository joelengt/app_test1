//Modulos y Dependencias
var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var mongoose = require('mongoose')
var passport = require('passport')
var multer = require('multer')
var cloudinary = require('cloudinary')
var ss = require('socket.io-stream')

var path = require('path')
var logger = require('morgan')
var favicon  =require('serve-favicon')
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var methodOverride = require('method-override')
var session = require('express-session')
var connect_express_flash = require('./controllers/connect_express_flash')

// middlawares
function middleware (req, res, next) {
  return next()
}

// configuración para correar el servidor
var config = require('./config')

//Conexión con Mongodb
mongoose.connect(config.mongodb.local , function (err) {
	if(err) {
		return console.log('Error al connectar database: ' + err)
	}
	console.log('Exito base de datos connectada')
})

cloudinary.config({
	cloud_name: config.cloudinary.cloud_name,
	api_key: config.cloudinary.api_key,
	api_secret: config.cloudinary.api_secret
})

// Configuración del servidor
app.set('port', process.env.PORT || 5000)
app.set('view engine', 'jade')
app.set('views', path.join(__dirname, './views'))

app.use(express.static(path.join(__dirname, './public')))
app.use(express.static(path.join(__dirname, './uploads')))
app.use(logger('dev'))
app.use(bodyParser.json({limit: '5mb'}))
app.use(bodyParser.urlencoded({     
        extended: true,
        limit: '5mb', 
    }))
// app.use(bodyParser.text({type : 'application/text-enriched', limit: '10mb'})
// app.use( bodyParser.raw({limit: '1mb'}) );   
// app.use(bodyParser.json({limit:1024*1024*20, type:'application/json'}))
// app.use(bodyParser.urlencoded({extended:true, limit:1024*1024*20, type:'application/x-www-form-urlencoding'}))
app.use(cookieParser())
app.use(methodOverride('_method'))
// app.use(favicon(path.join(__dirname, './public/images/favicon.ico')))

// Session timer estimate Limite: 60 segundos
//app.use(session({ secret: 'usuarioSession', cookie: { maxAge: 60} }))

// Session timer estimate Limite: 30 días
app.use(session({ secret: 'usuarioSession', cookie: { maxAge: 15 * 24 * 60 * 60 * 1000 }}))
//app.use(session({ secret: 'usuarioSession'))
app.use(multer({dest: './uploads'}))

// Middlewares de passport para login
app.use(passport.initialize())
app.use(passport.session())

// Controllers
var register_user = require('./controllers/login/passport')
var resenias_categority = require('./controllers/resenias')
var comunidad_publish_all = require('./controllers/comunidad/publicaciones')
var chatRooms = require('./controllers/chat')
var publish_muro_to_friend = require('./controllers/publish_to_friend')
//var publish_muro_to_progress = require('./controllers/progress_simulator')

register_user(app, passport)
resenias_categority(io)
comunidad_publish_all(io, ss)
chatRooms(io, ss)
publish_muro_to_friend(io, ss)
//publish_muro_to_progress(io)


// Routes requerimiento
var login = require('./routes/login')
var plataforma = require('./routes/plataforma')
var plataforma_passport = require('./routes/plataforma/passport')
var plataforma_start = require('./routes/plataforma/start')

var plataforma_perfil = require('./routes/plataforma/perfil')
var plataforma_muro = require('./routes/plataforma/muro')
var plataforma_friends = require('./routes/plataforma/friends')

var plataforma_cursos = require('./routes/plataforma/cursos')
var plataforma_diplomados = require('./routes/plataforma/diplomados')
var plataforma_payment = require('./routes/plataforma/payment')

var admin_dashboard_usuarios = require('./routes/admin/usuarios')
var admin_dashboard_cursos = require('./routes/admin/cursos')
var admin_dashboard_diplomados = require('./routes/admin/diplomados')
var admin_dashboard_preguntas = require('./routes/admin/preguntas')
var admin_dashboard_preguntas_cursos = require('./routes/admin/preguntas/cursos')
var admin_dashboard_preguntas_diplomados = require('./routes/admin/preguntas/diplomados')
var admin_dashboard = require('./routes/admin')

var plataforma_comunidad = require('./routes/plataforma/comunidad')
var plataforma_comunidad_find_friends = require('./routes/plataforma/comunidad/find_friends')
var plataforma_comunidad_friends = require('./routes/plataforma/comunidad/amigos')
var plataforma_comunidad_chat = require('./routes/plataforma/comunidad/chat')

var plataforma_notificaciones = require('./routes/plataforma/notificaciones')
var plataforma_notas_textos = require('./routes/plataforma/notas_textos')


//Routes usage
app.use('/', login)
app.use('/plataforma', plataforma)
app.use('/', plataforma_passport)
app.use('/plataforma/start', plataforma_start)

app.use('/plataforma/perfil', plataforma_perfil)
app.use('/plataforma/muro', plataforma_muro)
app.use('/plataforma/friends', plataforma_friends)

app.use('/plataforma/cursos', plataforma_cursos)
app.use('/plataforma/diplomados', plataforma_diplomados)
app.use('/plataforma/admin', admin_dashboard)
app.use('/plataforma/admin/usuarios', admin_dashboard_usuarios)
app.use('/plataforma/admin/cursos', admin_dashboard_cursos)
app.use('/plataforma/admin/diplomados', admin_dashboard_diplomados)
app.use('/plataforma/admin/preguntas', admin_dashboard_preguntas)
app.use('/plataforma/admin/preguntas/cursos', admin_dashboard_preguntas_cursos)
app.use('/plataforma/admin/preguntas/diplomados', admin_dashboard_preguntas_diplomados)
app.use('/plataforma/payment', plataforma_payment)
app.use('/plataforma/comunidad', plataforma_comunidad)
app.use('/plataforma/comunidad/find-friends', plataforma_comunidad_find_friends)
app.use('/plataforma/comunidad/friends', plataforma_comunidad_friends)
app.use('/plataforma/comunidad/chat', plataforma_comunidad_chat)
app.use('/plataforma/notificaciones', plataforma_notificaciones)
app.use('/plataforma/notas', plataforma_notas_textos)


// Error 404
app.use(function (req, res) {
	res.statusCode = 404
	res.send('Error 404: Pagina No Encontrada')
})

// Error 500
app.use(function (req, res) {
	res.statusCode = 500
	res.send('Error 500: Servidor Fail Request, Porfavor intentelo más tarde')
})


//Start server
http.listen(app.set('port'), function (err) {
	if(err) {
		return console.log('Error al iniciar server en el puerto: ' + err)
	}
	console.log('Server iniciado en el puerto: ' + app.set('port'))
})
