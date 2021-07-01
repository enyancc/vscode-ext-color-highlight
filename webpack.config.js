module.exports = {
  entry: './src/main.js',
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
    filename: 'dist/extension.js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  externals: {
    'vscode': 'vscode'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { targets: 'defaults' }]],
            plugins: ['@babel/transform-runtime'],
          }
        }
      }
    ]
  }
};

if (process.env.NODE_ENVIRONMENT !== 'production') {
  module.exports.devtool = 'source-map';
}
