const path = require('path');
const DtsBundleWebpack = require('dts-bundle-webpack');
var webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

var version = JSON.stringify(require("./package.json").version).replace(/\"/g, '');
var bannerOptions = {
  banner: 'lightjx v' + version + ' - https://github.com/TjWheeler/lightjx - MIT License',
  entryOnly: true
};

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
      { test: /\.txt$/, use: 'raw-loader' }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts'],
  },
  optimization: {
    mangleExports: false
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
    library: {
      name: 'lightjx',
      type: 'umd',
    },
    globalObject: 'globalThis'
  },
  optimization: {
    minimize: true,
    minimizer: [
        new TerserPlugin({
            terserOptions: {
                keep_classnames: true,
                keep_fnames: true
            }
          })
        ]
  },
  plugins: [
  //  new webpack.IgnorePlugin({ resourceRegExp: /^\.\/locale$/, contextRegExp: /moment$/, }),
    new DtsBundleWebpack({
      name: 'lightjx',
      main: './build/**/*.d.ts',
      out: '../dist/index.d.ts',
      removeSource: true,
      outputAsModuleFolder: true,
      headerPath: "header.txt"
    }),
    new webpack.BannerPlugin(bannerOptions),
    
  ]
};
