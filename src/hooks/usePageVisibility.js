import { useState, useEffect } from 'react'

const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Page_Visibility_API
    // 设置隐藏属性和改变可见属性的事件的名称
    let hidden, visibilityChange
    if (typeof document.hidden !== 'undefined') {
      hidden = 'hidden'
      visibilityChange = 'visibilitychange'
    } else if (typeof document.msHidden !== 'undefined') {
      hidden = 'msHidden'
      visibilityChange = 'msvisibilitychange'
    } else if (typeof document.webkitHidden !== 'undefined') {
      hidden = 'webkitHidden'
      visibilityChange = 'webkitvisibilitychange'
    }
    const isSupported =
      document && document.addEventListener && typeof document[hidden] !== 'undefined'

    if (!isSupported) return
    const handler = () => {
      setIsVisible(!document[hidden])
    }
    document.addEventListener(visibilityChange, handler)
    return () => {
      document.removeEventListener(visibilityChange, handler)
    }
  }, [])

  return isVisible
}

export default usePageVisibility
