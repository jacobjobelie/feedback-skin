const fs = require('fs')
const path = require('path')
const { createConfig } = require('cep-bundler-webpack')
const MONO_ROOT = path.join(process.cwd(), '../../')

const config = createConfig({
  root: MONO_ROOT,
  out: path.join(__dirname, '../src/panel-entry'),
  type: 'extendscript',
  entry: './src/extendscript/main.js',
  isDev: process.env.NODE_ENV === 'development',
})

module.exports = config
