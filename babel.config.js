module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current'
        }
      }
    ],
    ['@babel/preset-typescript', { allowDeclareFields: true }]
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@core': './src/core'
        }
      }
    ]
  ],
  ignore: ['**/*.spec.ts']
};
