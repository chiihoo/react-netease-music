import glfx from 'glfx'

/**
 * 图片高斯模糊
 * @param {String} url 图片链接
 * @param {Number} blur 模糊值
 */
export function imgBlurToBase64(url, blur) {
  let img = new Image()
  img.setAttribute('crossOrigin', 'anonymous')
  img.src = url
  return new Promise((resolve, reject) => {
    img.onload = () => {
      let canvas = glfx.canvas()
      let texture = canvas.texture(img)
      canvas.draw(texture).lensBlur(blur, -1, 0).update()
      resolve(canvas.toDataURL('image/jpeg'))
    }
  })
}
