const prefixRE = /^VUE_APP_/
const DotenvFlow = require('dotenv-flow')
const paths = require('../utils/paths')

module.exports = function resolveClientEnv(options, raw) {
  console.log(paths.paths)
  const dotenv = DotenvFlow.config({ path: paths.paths.env })
  const env = dotenv.parsed
  env.IS_PANEL = true
  env.PUBLIC_PATH = options.publicPath
  return {
    'process.env': JSON.stringify(env),
    'import.meta.env': JSON.stringify(env),
    'process.env.IS_PANEL': true,
  }
}
