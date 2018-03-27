const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');
const webpack = require('webpack');

const plugins = [
  new ExtractTextPlugin({
    // filename: './kommentator.css',
    filename: './bundle.css',
    allChunks: true,
  }),
  new webpack.optimize.ModuleConcatenationPlugin(),
];

module.exports = function webpackStuff(env) {
  if (env === 'production') plugins.push(new MinifyPlugin());

  return {
    entry: [
      './src/index.js',
      './styles/app.css',
    ],
    output: {
      filename: 'kommentator.js',
      // path: path.resolve(__dirname, './../web/frontend-files'),
      path: path.resolve(__dirname, './bundle.js'),
    },
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          presets: [
            'es2015',
          ],
          plugins: [],
        },
        include: [
          path.resolve(__dirname, './'),
        ],
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: 'css-loader?importLoaders=1',
        }),
      },
				{ test: /\.svg$/, loader: 'url-loader?limit=65000&mimetype=image/svg+xml&name=public/fonts/[name].[ext]' },
				{ test: /\.woff$/, loader: 'url-loader?limit=65000&mimetype=application/font-woff&name=public/fonts/[name].[ext]' },
				{ test: /\.woff2$/, loader: 'url-loader?limit=65000&mimetype=application/font-woff2&name=public/fonts/[name].[ext]' },
				{ test: /\.[ot]tf$/, loader: 'url-loader?limit=65000&mimetype=application/octet-stream&name=public/fonts/[name].[ext]' },
				{ test: /\.eot$/, loader: 'url-loader?limit=65000&mimetype=application/vnd.ms-fontobject&name=public/fonts/[name].[ext]' },
			],
    },
    plugins,
  };
};
