var path = require('path');
var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var glob = require('glob');
/*{
  "dayReports/day_reports":"./develop/views/dayReports/day_reports.js",
    "monthReports/month_reports.js":"./develop/views/monthReports/month_reports.js",
    "stewardDetailReport/detail_report_steward":"./develop/views/stewardDetailReport/detail_report_steward.js",
    "managerDetailReport/detail_report_manager":"./develop/views/managerDetailReport/detail_report_manager.js"
}*/
function getEntry(globPath, pathDir){
    var files = glob.sync(globPath);
    console.log(files);
    var entries = {},
        entry, dirname, basename, pathname, extname;

    for (var i = 0; i < files.length; i++) {
      entry = files[i];
      dirname = path.dirname(entry);
      extname = path.extname(entry);
      basename = path.basename(entry, extname);
      pathname = path.join(dirname, basename);
      pathname = pathDir ? pathname.replace(pathDir, '') : pathname;
      console.log(2, pathname, entry);
      entries[pathname] = './' + entry;
    }
    return entries;
}

module.exports = {
  /*entry: './develop/static/js/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: '/dist/static/js',
    filename: 'build.js'
  },*/
  entry:{
    "dayReports/day_reports":"./develop/views/dayReports/day_reports.js",
    "monthReports/month_reports.js":"./develop/views/monthReports/month_reports.js",
    "stewardDetailReport/detail_report_steward":"./develop/views/stewardDetailReport/detail_report_steward.js",
    "managerDetailReport/detail_report_manager":"./develop/views/managerDetailReport/detail_report_manager.js"
  },
  output: {
    path: path.resolve(__dirname, './dist/views'),//入口里引入的资源都会以这个作为公共目录输出
    publicPath:'',//配置上下文
    filename: '[name].build.js'
  },
  module: {
    rules: [
      {
        test:/\.(scss|css|sass)/,
        loader:'style-loader!css-loader!sass-loader'//ExtractTextPlugin.extract("style-loader","css-loader","sass-loader")
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test:/\.png/,
        loader:'url-loader',/*把小于1KB的图片base-64内联，减少http请求*/
        query:{limit:1024}
      }
    ]
  },
  resolve: {
    extensions:['.js','.vue','.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      'components':path.join(__dirname,'./develop/static/js/components'),
      'utils':path.join(__dirname,'./develop/static/js/mylibs')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    inline:true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    //js文件压缩
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
      },
      output: {
        comments: false,
      },
      sourceMap: true
    }),
    //提供全局的变量，在模块中使用无需用require引入
    new webpack.ProvidePlugin({
      jQuery:'jquery',
      $: 'jquery'
    }),//直接定义第三方库

    //将公共代码抽离出来合并为一个文件
    new CommonsChunkPlugin("common.chunk.js"),
    new ExtractTextPlugin('')

  ]
}


