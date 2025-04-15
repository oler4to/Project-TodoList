const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  mode: 'production',
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      inject: false,
      template: "./src/index.html",
    }),
  ],
  module: {
    rules: [
      {
  test: /\.css$/,
  use: [
    'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: true
      }
    }
  ]
},
      {
        test: /\.(woff|otf|ttf)$/i,
        type: 'asset/resource',
      },
    ],
  },
}
