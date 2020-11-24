const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const prod = process.env.NODE_ENV === 'production';
const dev = ! prod;
const filename = ext => dev ? `bundle.${ext}` : `bundle.[fullhash].${ext}`;
const loaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ];

  if (dev) {
    loaders.push('eslint-loader');
  }

  return loaders;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: filename('js'),
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@core': path.resolve(__dirname, 'src/core'),
    },
  },
  devtool: dev ? 'source-map' : false,
  devServer: {
    contentBase: './dist',
    port: 3000,
    hot: dev,
    open: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(
        {
          'template': 'index.html',
          'minify': {
            removeComments: prod,
            collapseWhitespace: prod,
          },
        }
    ),
    new CopyPlugin(
        {
          patterns: [
            {
              from: path.resolve(__dirname, 'src/favicon.ico'),
              to: path.resolve(__dirname, 'dist/favicon.ico'),
            },
          ],
        }
    ),
    new MiniCssExtractPlugin(
        {
          filename: filename('css'),
        }
    ),
  ],
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: loaders(),
      },
    ],
  },
};
