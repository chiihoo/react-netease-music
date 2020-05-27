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
