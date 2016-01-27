module.exports = {
  entry: './src/extension.js',
  output: {
    libraryTarget: 'commonjs2',
    filename: 'dist/extension.js'
  },
  externals: {
    'vscode': 'vscode'
  },
  module: {
    loaders: [{
      test: /json$/,
      loader: 'json'
    }]
  }
};
