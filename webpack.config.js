module.exports = {
  entry: './src/main.js',
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

if (process.env.NODE_ENVIRONMENT !== 'production') {
  module.exports.devtool = 'inline-source-map';
}
