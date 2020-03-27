const { override, addPostcssPlugins, addWebpackAlias } = require('customize-cra')
const path = require('path')

module.exports = override(
  addPostcssPlugins([
    require('postcss-px-to-viewport')({
      // 把px单位转换为vw、vh、vmin或者vmax这样的视窗单位
      viewportWidth: 375, // (Number) The width of the viewport.
      viewportHeight: 667, // (Number) The height of the viewport.
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw', // (String) Expected units.
      selectorBlackList: ['.ignore', '.hairlines'], // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
      mediaQuery: false // (Boolean) Allow px to be converted in media queries.
    }),
    require('postcss-write-svg')({
      // 主要用来处理移动端1px问题
      utf8: false
    }),
    require('cssnano')({
      // 主要用来压缩和清理CSS代码
      'cssnano-preset-advanced': {
        zindex: false,
        autoprefixer: false
      }
    })
  ]),
  addWebpackAlias({ ['@']: path.resolve(__dirname, 'src') }) // 设置src文件的别名'@'
)
