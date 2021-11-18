const path = require('path')
const { createConfig } = require('cep-bundler-webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isDev = process.env.IS_DEV === '1'
const dest = path.join(__dirname, 'dist')

const config = createConfig({
  type: 'cep',
  id: 'com.pessl.webpack',
  entry: './src/app/main.js',
  out: dest,
  isDev: isDev,
  devPort: 3000,
})

const { merge } = require('webpack-merge')
const common = require('./webpack.common.js')

const final = merge(config, common, {
  resolve: {
    mainFields: ['browser', 'module', 'main'],
  },
})
console.log(final)
module.exports = final
