const path = require('path');

module.exports = (_, argv) => ({
  entry: path.join(__dirname, 'src', 'index.jsx'),
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'build'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    symlinks: false,
  },
  devtool: (argv.mode === 'development' ? 'cheap-module-eval-source-map' : 'none'),
  module: {
    rules: [
      {
        test: /\.jsx?/,
        include: path.resolve(__dirname, 'src'),
        loader: 'babel-loader',
        options: {
          cacheDirectory: argv.mode === 'development',
        },
      },
    ],
  },
});
