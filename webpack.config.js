
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  entry: {
    popup: path.join(__dirname, "popup.js"),
    options: path.join(__dirname, "options.js"),
    background: path.join(__dirname, "background.js")
  },
  module: {
    rules: [
      { test: /\.css$/, use: ['style-loader', 'css-loader'], exclude: /node_modules/},
      { test: /\.js$/, use: 'babel-loader', exclude: /node_modules/},
      { test: /\.html$/, use: "html-loader", exclude: /node_modules/},
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "index-bundle.js"
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: "manifest.json",
      transform: function (content, path) {
        return Buffer.from(JSON.stringify({
          description: process.env.npm_package_description,
          version: process.env.npm_package_version,
          ...JSON.parse(content.toString())
        }))
      }
    }]),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "popup.html"),
      filename: "popup.html",
      chucks: ["popup"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "options.html"),
      filename: "options.html",
      chucks: ["options"]
    }),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "background.html"),
      filename: "background.html",
      chucks: ["background"]
    })
  ],
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development'
}