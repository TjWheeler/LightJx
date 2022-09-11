const path = require('path');
const {CleanWebpackPlugin} = require("clean-webpack-plugin");

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, './src/Validate.ts'),
  devtool:'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: [/node_modules/],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts'],
  },
  output: {
    filename: 'bundle.js',
    library: 'Validate',
    path: path.resolve(__dirname, 'dist'),
  },
  
  plugins: [
    new CleanWebpackPlugin(),
  ]
};
