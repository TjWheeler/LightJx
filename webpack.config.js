const path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const DtsBundleWebpack = require('dts-bundle-webpack');
const { IgnorePlugin } = require('webpack');
module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, './src/index.ts'),
  devtool: 'source-map',
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
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    library: {
      name: 'lightjx',
      type: 'umd',
    },
  },

  plugins: [
    new IgnorePlugin({resourceRegExp: /^\.\/locale$/,
    contextRegExp: /moment$/,}),
    new DtsBundleWebpack({
      name: 'lightjx',
      main: './build/**/*.d.ts',
      out: '../dist/index.d.ts',
      removeSource: true,
      outputAsModuleFolder: true
    }),
    new CleanWebpackPlugin(),
  ]
};
