import * as StackBlur from 'stackblur-canvas'
// import glfx from 'glfx'

/**
 * 图片高斯模糊 glfx库
 * @param {String} url 图片链接
 * @param {Number} blur 模糊值
 */
// export function imgBlurToBase64(url, blur) {
//   let img = new Image()
//   img.setAttribute('crossOrigin', 'anonymous')
//   img.src = url
//   return new Promise((resolve, reject) => {
//     img.onload = () => {
//       let canvas = glfx.canvas()
//       let texture = canvas.texture(img)
//       canvas.draw(texture).lensBlur(blur, -1, 0).update()
//       resolve(canvas.toDataURL('image/jpeg'))
//     }
//   })
// }

/**
 * 图片高斯模糊 stackblur-canvas库 用的人多
 * @param {String} url 图片链接
 * @param {Number} radius 模糊半径
 * @param {Boolean} blurAlphaChannel 是否模糊一个RGBA图像
 */
export function imgBlurToBase64(url, radius, blurAlphaChannel = false) {
  let img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = url
  return new Promise((resolve, reject) => {
    img.onload = () => {
      let canvas = document.createElement('canvas')
      StackBlur.image(img, canvas, radius, blurAlphaChannel)
      resolve(canvas.toDataURL('image/jpeg'))
    }
  })
}

/**
 * 处理播放次数，123456次 -> 12万，123次 -> 123次
 * @param {Number} number 播放量
 */
export function handleNumber(number) {
  return number >= 100000 ? parseInt(number / 10000) + '万' : number
}

/**
 * 生成随机全局唯一标识码
 */
export function guidGenerator() {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4()
}

/**
 * 判断设备是PC还是Mobile
 */
export function isPC() {
  const useAgent = navigator.userAgent
  const arr = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod']
  for (let i = 0; i < arr.length; i++) {
    if (useAgent.includes(arr[i])) {
      return false
    }
  }
  return true
}

/**
 * 解析歌词
 * @param {String} lrc lrc歌词字符串
 * @return {Object}  {毫秒1:歌词1, 毫秒2:歌词2,...}
 */
export function parseLrc(lrc) {
  let lrcObj = {}
  let linesTemp = lrc.split('\n')
  // 拆成每行
  for (let line of linesTemp) {
    // 文本：[01:05.26][02:19.16][03:14.30]我们之间的距离好像忽远又忽近
    // 把整体的[01:05.26][02:19.16][03:14.30]去掉，得到文本text
    let text = line.replace(/^\[.+\]/, '')
    // exec每次只能匹配第一个，/g时多次调用可以直接查找下一个
    // 单个的[01:05.26]
    let timeReg = /\[(\d+):(\d+\.\d+)\]/g
    let matches = timeReg.exec(line)
    while (matches !== null) {
      // 将时间戳转为毫秒，字符串 * 会自动转为数字
      let time = matches[1] * 60 * 1000 + matches[2] * 1000
      lrcObj[time] = text
      matches = timeReg.exec(line)
    }
    // 也可以使用ES11的String.prototype.matchAll()，它的功能完善，不过现在兼容性不佳。
    // 而match方法只能返回匹配结果，不能返回正则的分组捕获结果。
    // let res = line.matchAll(/\[(\d+):(\d+\.\d+)\]/g)
    // for (let item of res) {
    //   let time = item[1] * 60 * 1000 + item[2] * 1000
    //   lrcObj[time] = text
    // }
  }
  return lrcObj
}

/**
 * 把秒格式化成 XX:XX 分:秒的形式
 * @param {Number} time
 */
export function formatTime(time) {
  const intTime = Math.floor(time)
  let minutes = Math.floor(intTime / 60)
  let seconds = intTime % 60
  if (minutes < 10) {
    minutes = '0' + minutes
  }
  if (seconds < 10) {
    seconds = '0' + seconds
  }
  return minutes + ':' + seconds
}

/**
 * 把毫秒时间戳格式化成类似 2020.10.01 的形式
 * @param {Number} time
 */
export function formatTimeToDate(time) {
  const date = new Date(time)
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDay()
  if (month < 10) {
    month = '0' + month
  }
  if (day < 10) {
    day = '0' + day
  }
  return year + '.' + month + '.' + day
}
