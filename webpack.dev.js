const { merge } = require('webpack-merge'); //webpack-mergeの読み込み
const commonConfig = require('./webpack.common'); //webpackのcommon設定ファイルの読み
const path = require('path'); //Nodeのpathモジュールの使用

module.exports = merge(commonConfig, {
  mode: 'development', //webpackの出力モードを設定
  devServer: {
    watchFiles: ['src/**/*', 'public/**/*'], //監視するファイル対象の追加
    static: {
      directory: path.resolve(__dirname, 'public'),
    },
    client: {
      overlay: true /* エラーをブラウザに表示してくれる */,
    },
    port: 9000,
    open: true,
  },
  target: 'web',
});
