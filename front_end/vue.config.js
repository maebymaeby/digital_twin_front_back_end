const webpack = require("webpack");

module.exports = {
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        Popper: ['popper.js', 'default']
      })
    ],
  },
  chainWebpack(config) {
    config.plugin('html').tap(args => {
      args[0].title = '冷端系统数字孪生模型库';
      return args;
    })
  },
  publicPath: '/',
}