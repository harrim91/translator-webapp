const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = (_, argv) => {
  const isDevelopment = argv.mode === 'development';
  return {
    entry: path.join(__dirname, 'src', 'index.jsx'),
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'build'),
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      symlinks: false,
    },
    devtool: (isDevelopment ? 'cheap-module-eval-source-map' : 'none'),
    module: {
      rules: [
        {
          test: /\.jsx?/,
          include: path.resolve(__dirname, 'src'),
          loader: 'babel-loader',
          options: {
            cacheDirectory: isDevelopment,
          },
        },
      ],
    },
    plugins: (function configurePlugins() {
      if (isDevelopment) {
        return [new Dotenv()];
      }
      return [];
    }()),
  };
};
