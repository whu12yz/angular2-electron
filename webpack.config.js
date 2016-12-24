// Helper: root() is defined at the bottom
var path = require('path');
var webpack = require('webpack');

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
// var autoprefixer = require('autoprefixer');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');
/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ROOT_PATH = path.resolve(__dirname);
// var ENTRY_PATH = path.resolve(ROOT_PATH, './src');
var BUILD_PATH = path.resolve(ROOT_PATH, './dist');

module.exports =  {
  entry : {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts' // our angular app
  },

  output : {
    path: BUILD_PATH,
    publicPath: '',
    filename : 'app/[name].js',
    chunkFilename :  'app/[id].chunk.js'
  },

  resolve : {
    // only discover files that have those extensions
    extensions: ['.ts', '.js', '.json', '.css', '.scss', '.html'],
  },
  module : {
    rules: [
      // Support for .ts files.
      {
        test: /\.ts$/,
        loaders: ['awesome-typescript-loader', 'angular2-template-loader', '@angularclass/hmr-loader'],
        exclude: [ /\.(spec|e2e)\.ts$/, /node_modules\/(?!(ng2-.+))/]
      },

      // copy those assets to output
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=fonts/[name].[hash].[ext]?'
      },

      // Support for *.json files.
      {test: /\.json$/, loader: 'json-loader'},

      // Support for CSS as raw text
      // use 'null' loader in test mode (https://github.com/webpack/null-loader)
      // all css in src/style will be bundled in an external css file
      {
        test: /\.css$/,
        exclude: root('src', 'app'),
        loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css-loader', 'postcss-loader']})
      },
      // all css required in src/app files will be merged in js files
      {test: /\.css$/, include: root('src', 'app'), loader: 'raw-loader!postcss-loader'},

      // support for .scss files
      // use 'null' loader in test mode (https://github.com/webpack/null-loader)
      // all css in src/style will be bundled in an external css file
      {
        test: /\.(scss|sass)$/,
        exclude: root('src', 'app'),
        loader:  ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: ['css-loader', 'postcss-loader', 'sass-loader']})
      },
      // all css required in src/app files will be merged in js files
      {test: /\.(scss|sass)$/, exclude: root('src', 'style'), loader: 'raw-loader!postcss-loader!sass-loader'},

      // support for .html as raw text
      // todo: change the loader to something that adds a hash to images
      {test: /\.html$/, loader: 'raw-loader',  exclude: root('src', 'public')}
    ]
  },
  plugins : [
      new webpack.ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        root('./src') // location of your src
      ),
      new CopyWebpackPlugin([
        {from: root('src/public')},
        {from: __dirname + '/src/app', to: __dirname + '/dist/app' }],
        {
          ignore :[
            '*.ts',
            '*.scss',
            '*.js'
          ]
        }
        ),
      new OpenBrowserPlugin({
        url: 'http://localhost:8080'
      }),
      new ExtractTextPlugin('app/main.css'),
      new HtmlWebpackPlugin({           //根据模板插入css/js等生成最终HTML
        filename:'./index.html',  //生成的html存放路径，相对于 path
        template:'./src/public/index.html', //html模板路径
        inject:'body',  //允许插件修改哪些内容，包括head与body
        hash:true,  //为静态资源生成hash值
        chunks : ['app', 'vendor', 'polyfills'],
        minify:{  //压缩HTML文件
          removeComments:true,  //移除HTML中的注释
          collapseWhitespace:false //删除空白符与换行符
        }
      }),
      new CommonsChunkPlugin({
        names : ['app', 'vendor', 'polyfills'],    //共享块插件，打包出新的manifest文件，加入之后方可自动在index中link相应的css文件，在打包的多个js文件中建立衔接关系
      }),
      // new CleanWebpackPlugin(['dist'], {
      //   root: ROOT_PATH,
      //   verbose: true,
      //   dry: false,
      // }),
  ],

  devServer:{
    contentBase: './dist',
    historyApiFallback: true,
    quiet: true,
    stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and ver
  }


};

// Helper functions
function root(args) {
  args = Array.prototype.slice.call(arguments, 0);
  return path.join.apply(path, [__dirname].concat(args));
}
