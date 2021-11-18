const { join } = require('path');
const config = require('../project.config')
const { merge } = require('webpack-merge')
const { VueLoaderPlugin } = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const cssWebpackConfig = require('./css')
const CopyPlugin = require('copy-webpack-plugin');
const { VanillaExtractPlugin } = require('@vanilla-extract/webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const targetDirectory = join(__dirname, 'dist');

const isProduction = process.env.NODE_ENV === 'production';


const publicPath = '/';
const mode = isProduction ? 'production' : 'development';

const base =
  {
    name: 'client',
    output: {
      filename: 'client.js',
      path: targetDirectory,
      publicPath: '/',
    },
    entry: {
     app: ['./src/main.ts'],
   },
    devServer: {
      open: !isProduction,
    },
    mode,
    resolve: {
      extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    module: {
      rules: [
       {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
         // ts
      {
       test: /\.tsx?$/,
       use: [
         'thread-loader',
         'babel-loader',
         {
           loader: 'ts-loader',
           options: {
             transpileOnly: true,
             appendTsSuffixTo: ['\\.vue$'],
             happyPackMode: true,
           },
         },
       ],
     },

        {
          test: /\.vanilla\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.mdx?$/,
          use: ['mdx-loader'],
        },
        {
          test: /\.(png?)$/,
          use: ['file-loader'],
        },
      ],
    },
    plugins: [
     new VueLoaderPlugin(),
      new VanillaExtractPlugin({
        test: /\.css\.ts$/,
        outputCss: true,
      }),
      new MiniCssExtractPlugin(),
    ],
    stats: 'errors-only',
  }


  module.exports = merge(base, cssWebpackConfig, {
   mode: 'development',

   devtool: 'eval-cheap-module-source-map',

   devServer: {
     historyApiFallback: {
       rewrites: [{ from: /./, to: '/index.html' }],
     },
     devMiddleware: {
       publicPath: config.dev.publicPath,
     },
     hot: false,
     open: false,
     host: '0.0.0.0',
     port: config.dev.port,
     liveReload: false,
   },

   infrastructureLogging: {
     level: 'warn',
   },
 })
