module.exports = function (api) {
  api.cache(true)

  const presets = [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage', // adds specific imports for polyfills when they are used in each file.
        modules: false, // preserve ES modules.
        corejs: { version: 3, proposals: true }, // enable polyfilling of every proposal supported by core-js.
      },
    ],
    '@babel/typescript',
  ]
  const plugins = ['@babel/plugin-transform-runtime']

  return {
    presets,
    plugins,
    exclude: [/core-js/],
  }
}
