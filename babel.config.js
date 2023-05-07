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
                    '@Core': './src/Core'
                }
            }
        ]
    ],
    ignore: ['**/*.spec.ts']
};
