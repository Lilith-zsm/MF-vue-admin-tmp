const TerserPlugin = require('terser-webpack-plugin') // 用于在生成环境剔除debuger和console
const CompressionPlugin = require('compression-webpack-plugin') // gzip压缩,优化http请求,提高加载速度
const path = require('path')
const resolve = dir => {
  return path.join(__dirname, dir)
}

const cdn = {
  // 开发环境
  dev: {
    css: [],
    js: []
  },
  // 生产环境
  build: {
    css: [
      '/static/common/css/theme-chalk.css',
      '/static/common/css/nprogress.min.css'
    ],
    js: [
      '/static/common/vue.min.js',
      '/static/common/vue-router.min.js',
      '/static/common/vuex.min.js',
      '/static/common/axios.min.js',
      '/static/common/vue-i18n.min.js',
      '/static/common/element-ui.js',
      '/static/common/echarts.min.js',
      '/static/common/mock-min.js',
      '/static/common/nprogress.min.js',
      '/static/common/js.cookie.min.js'
    ]
  }
}
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/',
  outputDir: './dist',
  assetsDir: 'static',
  filenameHashing: true, // false 来关闭文件名哈希
  // 是否开启eslint保存检测，有效值：ture | false | 'error'
  lintOnSave: process.env.NODE_ENV === 'development',
  // 打包时不生成.map文件
  productionSourceMap: false,
  devServer: {
    proxy: {
      '^/api': {
        target: process.env.VUE_APP_GATEWAY_URL,
        ws: true,
        changeOrigin: true, // 是否跨域
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  // webpack相关配置
  chainWebpack: (config) => {
    config.entry.app = ['./src/main.js']
    config.resolve.alias
      .set('@', resolve('src'))
      .set('cps', resolve('src/components'))
    // 关闭npm run build之后，This can impact web performance 警告
    config.performance
      .set('hints', false)
    // 移除 prefetch 插件
    config.plugins.delete('prefetch')
    // 移除 preload 插件
    config.plugins.delete('preload')
    // 压缩代码
    config.optimization.minimize(true)
    // 分割代码
    config.optimization.splitChunks({
      chunks: 'all'
    })
    // 对图片进行压缩处理
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        disable: true, // webpack@2.x and newer
        quality: '65-80',
        speed: 4
      })
      .end()
    // 对vue-cli内部的 webpack 配置进行更细粒度的修改。
    // 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
    config
      .plugin('html')
      .tap(args => {
        if (process.env.NODE_ENV === 'production') {
          args[0].cdn = cdn.build
        }
        if (process.env.NODE_ENV === 'development') {
          args[0].cdn = cdn.dev
        }
        return args
      })
  },
  configureWebpack: config => {
    // 为生产环境修改配置...
    if (process.env.NODE_ENV === 'production') {
      // 忽略生产环境打包的文件
      config.externals = {
        'vue': 'Vue',
        'vue-router': 'VueRouter',
        'vuex': 'Vuex',
        'vue-i18n': 'VueI18n',
        'axios': 'axios',
        'element-ui': 'ELEMENT',
        'echarts': 'echarts',
        'mockjs': 'Mock',
        'nprogress': 'NProgress',
        'js-cookie': 'Cookies'
      }
      // 去除console来减少文件大小，效果同'UglifyJsPlugin'
      new TerserPlugin({
        cache: true,
        parallel: true,
        sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            warnings: false,
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          }
        }
      })
      // 开启gzip压缩
      config.plugins.push(new CompressionPlugin({
        algorithm: 'gzip',
        test: new RegExp('\\.(' + ['js', 'css'].join('|') + ')$'), // 匹配文件扩展名
        // threshold: 10240, // 对超过10k的数据进行压缩
        threshold: 5120, // 对超过5k的数据进行压缩
        minRatio: 0.8,
        cache: true, // 是否需要缓存
        deleteOriginalAssets: false // true删除源文件(不建议);false不删除源文件
      }))
    } else {
      // 为开发环境修改配置...

    }
  },
  // 第三方插件配置
  pluginOptions: {

  }
}
