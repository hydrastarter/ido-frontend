const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const Dotenv = require('dotenv-webpack');
require('process');

module.exports = (env) => ({
  mode: 'development',
  entry: path.join(__dirname, 'src', 'index.tsx'),

  output: {
    path: path.resolve(__dirname, 'build'),
  },

  module: {
    rules: [
      {
        test: /\.?js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/i,
        loader: 'file-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.m?js/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",  // Inject styles into the DOM
          "css-loader",    // Translates CSS into CommonJS
          "sass-loader"    // Compiles Sass to CSS
        ]
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /favicon\.ico$/,
        loader: 'url-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.cjs'],
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
    },
  },

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    hot: true,
    port: 3000,
    historyApiFallback: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'public', 'index-template.html'),
      favicon: path.join(__dirname, 'public', 'favicon.ico'),
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new Dotenv({
      path: `.env${env.file ? `.${env.file}` : ''}`,
    }),
  ],
});
