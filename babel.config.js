module.exports = {
  presets: [
    '@babel/preset-react',
    [
      '@babel/preset-env',
      {
        modules: 'commonjs',
      },
    ],
  ],

  plugins: [
    process.env.NODE_ENV !== 'production' && 'react-refresh/babel',
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/transform-runtime',
    '@babel/plugin-proposal-class-properties',
    [
      'import',
      {
        libraryName: 'antd',
        style: true,
      },
    ],
  ].filter(Boolean),
}
