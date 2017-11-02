var path = require('path')
var webpack = require('webpack')
var dotenv = require('dotenv')

dotenv.load()

process.traceDeprecation = true

const entry = [ './app/main' ]
const transforms = [
  {
    transform: 'react-transform-catch-errors',
    imports: ['react', 'redbox-react']
  }
]
const plugins = [
  new webpack.NoEmitOnErrorsPlugin(),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.FACEBOOK_ID': JSON.stringify(process.env.FACEBOOK_ID)
  })
]

if (process.env.NODE_ENV !== 'production') {
  entry.unshift('webpack-hot-middleware/client')
  transforms.unshift({
    transform: 'react-transform-hmr',
    imports: ['react'],
    locals: ['module']
  })
  plugins.unshift(new webpack.HotModuleReplacementPlugin())
}

var config = {
  devtool: 'cheap-module-eval-source-map',
  entry,
  output: {
    path: path.join(__dirname, 'public', 'js'),
    filename: 'bundle.js',
    publicPath: '/js'
  },
  plugins,
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          plugins: [
            ['react-transform', {
              transforms
            }]
          ]
        }
      }
    ]
  }
}

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    })
  )
}

module.exports = config
