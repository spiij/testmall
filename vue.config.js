module.exports = {
  configureWebpack: {
    resolve: {
      extensions: [],
      alias: {
        'assets': 'src/assets',
        'common': '@/common',
        'components': '@/components',
        'network': '@/network',
        'views': '@/views'
      }
    }
  }
}