const path = require('path')
const ABSOLUTE_BASE = __dirname
module.exports = {
  ABSOLUTE_BASE,
  NODE_MODULES_DIR: path.join(ABSOLUTE_BASE, 'node_modules'),
  WORKSPACE_NODE_MODULES_DIR: path.join(
    ABSOLUTE_BASE,
    '../../node_modules',
  ),
  env: path.join(ABSOLUTE_BASE, '../configs'),
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
