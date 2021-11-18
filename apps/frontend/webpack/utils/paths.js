'use strict'

const path = require('path')

// gen static file path
exports.getAssetPath = (...args) => path.posix.join('static', ...args)

// gen absolute path
exports.resolve = (...args) => path.posix.join(process.cwd(), ...args)

const ABSOLUTE_BASE = path.join(__dirname, '../')
exports.paths = {
  ABSOLUTE_BASE,
  NODE_MODULES_DIR: path.join(ABSOLUTE_BASE, 'node_modules'),
  WORKSPACE_NODE_MODULES_DIR: path.join(
    ABSOLUTE_BASE,
    '../../node_modules',
  ),
  env: path.join(ABSOLUTE_BASE, '../configz/panel'),
  // Source files
  src: path.resolve(ABSOLUTE_BASE, '../src'),
  srcAssets: path.resolve(
    path.resolve(ABSOLUTE_BASE, '../src'),
    'assets',
  ),

  // Production build files
  build: path.resolve(ABSOLUTE_BASE, '../dist'),

  // Static files that get copied to build folder
  public: path.resolve(ABSOLUTE_BASE, '../public'),
  publicAssets: path.resolve(
    path.resolve(ABSOLUTE_BASE, '../public'),
    'assets',
  ),
}
