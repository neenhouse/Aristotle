
var path = require('path'),
    webpack = require('webpack'),
    webpackDevServer = require("webpack-dev-server"),
    open = require('open'),
    devPort = 3600;

var config = {
  entry: [
    './src/app',
    'webpack/hot/only-dev-server',
    'webpack-dev-server/client?http://localhost:'+devPort+'/'
  ],
  output: {
    path: path.join(__dirname, 'demo'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  plugins: [new webpack.HotModuleReplacementPlugin()],
  resolve: {
    extensions: [
      '',
      '.js',
      '.css',
      '.less',
      '.json'
    ]
  },
  module: {
    preLoaders: [
        {
            test: /\.js$/, // include .js files
            exclude: /node_modules/, // exclude any and all files in the node_modules folder
            loader: 'eslint-loader'
        }
    ],
    loaders: [
      {
        test: /\.js$/,
        loader:'babel',
        include:[
          path.join(__dirname, 'src')
        ],
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins:[]
        }
      },
      {
        test: /\.less$/,
        loader: "style!css!less"
      },
      {
        test: /\.css$/,
        loader: "style!css"
      },
      {
        test: /\.json$/,
        loader: "json"
      }
    ]
  },
  eslint: {
    configFile: path.join(__dirname, '.eslintrc'),
    quiet:true,
    failOnError:true,
    emitError:true
  }
}

// Define compiler
var compiler = webpack(config);

// Define server
var server = new webpackDevServer(compiler, {
  hot:true,
  inline:true,
  contentBase:path.join(__dirname, 'demo')
});

// Start server
server.listen(devPort);

// Open page
open('http://localhost:'+devPort);
