module.exports = {
  comments: false,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ]
  ],
  plugins: [['@babel/plugin-proposal-class-properties', { loose: true }]],
  env: {
    node: {
      sourceMaps: 'both',
      sourceType: 'unambiguous',
      sourceFileName: 'index.js'
    }
  },
  ignore: ['node_modules']
}
