const { merge }    = require('webpack-merge');
const commonConfig = require('./webpack.common');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(commonConfig, {
  mode: 'production',//webpackの出力モードを設定
  optimization: {    //バンドル時のオプション
    minimizer: [
      new TerserPlugin({
        extractComments: false, //ライブラリのコメントが抽出されたファイルの作成を無しに
        terserOptions: {
          compress: {
            drop_console: true, //console.logが削除される
          },
        },
      }),
      new OptimizeCssAssetsWebpackPlugin(),
    ],
  },
});