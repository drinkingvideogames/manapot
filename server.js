var express = require('express')
var path = require('path')
var logger = require('morgan')
var compression = require('compression')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var expressValidator = require('express-validator')
var dotenv = require('dotenv')
var React = require('react')
var ReactDOM = require('react-dom/server')
var Router = require('react-router')
var Provider = require('react-redux').Provider
var mongoose = require('mongoose')
var jwt = require('jsonwebtoken')
var sass = require('node-sass-middleware')
var webpack = require('webpack')
var config = require('./webpack.config')
const favicon = require('serve-favicon')

// Load environment variables from .env file
dotenv.load()

// ES6 Transpiler
require('babel-core/register')
require('babel-polyfill')

// Models
var User = require('./models/User')

// Controllers
var authController = require('./controllers/auth')
var contactController = require('./controllers/contact')

// React and Server-Side Rendering
var routes = require('./app/routes')
var configureStore = require('./app/store/configureStore').default

var app = express()

var compiler = webpack(config)

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB, { useMongoClient: true })
mongoose.connection.on('error', function () {
  console.log('MongoDB Connection Error. Please make sure that MongoDB is running.')
  process.exit(1)
})
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')
app.set('port', process.env.PORT || 3000)
app.use(compression())
app.use(sass({ src: path.join(__dirname, 'public'), dest: path.join(__dirname, 'public') }))
app.use(logger(app.get('env') !== 'production' ? 'dev' : 'common'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(expressValidator())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

app.use((req, res, next) => {
  res.setHeader('X-Clacks-Overhead', 'GNU Terry Pratchett')
  next()
})

app.use(function (req, res, next) {
  req.isAuthenticated = function () {
    var token = (req.headers.authorization && req.headers.authorization.split(' ')[1]) || req.cookies.token
    try {
      return jwt.verify(token, process.env.TOKEN_SECRET)
    } catch (err) {
      return false
    }
  }

  if (req.isAuthenticated()) {
    var payload = req.isAuthenticated()
    User.findById(payload.sub)
      .populate('roles')
      .then((user) => {
        if (user) req.user = user.toObject({ virtuals: true })
        next()
      }, next)
      .catch(next)
  } else {
    next()
  }
})

if (app.get('env') === 'development' || !app.get('env')) {
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))
  app.use(require('webpack-hot-middleware')(compiler))
}

const apis = {
  genre: require('./controllers/genre'),
  drink: require('./controllers/drink'),
  game: require('./controllers/game'),
  user: require('./controllers/user'),
  role: require('./controllers/role'),
  asset: require('./controllers/asset')
}

app.post('/contact', contactController.contactPost)
app.put('/account', authController.ensureAuthenticated, authController.accountPut)
app.delete('/account', authController.ensureAuthenticated, authController.accountDelete)
app.post('/signup', authController.signupPost)
app.post('/login', authController.loginPost)
app.post('/forgot', authController.forgotPost)
app.post('/reset/:token', authController.resetPost)
app.get('/unlink/:provider', authController.ensureAuthenticated, authController.unlink)
app.post('/auth/facebook', authController.authFacebook)
app.get('/auth/facebook/callback', authController.authFacebookCallback)
app.post('/auth/google', authController.authGoogle)
app.get('/auth/google/callback', authController.authGoogleCallback)
app.post('/auth/twitter', authController.authTwitter)
app.get('/auth/twitter/callback', authController.authTwitterCallback)
app.use('/api/genre', apis.genre)
app.use('/api/drink', apis.drink)
app.use('/api/game', apis.game)
app.use('/api/user', apis.user)
app.use('/api/role', apis.role)
app.use('/api/asset', apis.asset)
app.use('/api/teapot', (req, res) => { res.status(418).send({ msg: 'I\'m a teapot' }) })

// React server rendering
app.use(function (req, res) {
  var initialState = {
    auth: { token: req.cookies.token, user: req.user },
    messages: {},
    styles: {
      mainColour: '#ffffff',
      mainBg: '#2196f3',
      bg: '#ffffff'
    }
  }

  var store = configureStore(initialState)

  Router.match({ routes: routes.default(store), location: req.url }, function (err, redirectLocation, renderProps) {
    if (err) {
      res.status(500).send(err.message)
    } else if (redirectLocation) {
      res.status(302).redirect(redirectLocation.pathname + redirectLocation.search)
    } else if (renderProps) {
      var html = ReactDOM.renderToString(React.createElement(Provider, { store: store },
        React.createElement(Router.RouterContext, renderProps)
      ))
      res.render('layout', {
        html: html,
        initialState: store.getState(),
        title: 'Manapot'
      })
    } else {
      res.sendStatus(404)
    }
  })
})

// Production error handler
if (app.get('env') === 'production') {
  app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.sendStatus(err.status || 500)
  })
}

app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'))
})

module.exports = app
