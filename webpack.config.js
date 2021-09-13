const baseConfig = {
  entry: './src/main.js',
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

const nodeConfig = {
  ...baseConfig,
  target: 'node',
  output: {
    libraryTarget: 'commonjs2',
    filename: 'extension-node.js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  }
};

const webConfig = {
  ...baseConfig,
  target: 'webworker',
  output: {
    libraryTarget: 'commonjs2',
    filename: 'extension-web.js',
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  resolve: {
    fallback: {
      'path': require.resolve('path-browserify'),
      'fs': false 
    }
  }
};

module.exports = [nodeConfig, webConfig];

if (process.env.NODE_ENVIRONMENT !== 'production') {
  module.exports.devtool = 'source-map';
}
