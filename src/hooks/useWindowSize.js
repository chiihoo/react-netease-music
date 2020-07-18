import { useState, useEffect } from 'react'

/**
 * 监听浏览器resize时间，并实时获取浏览器窗口宽高
 */
const useWindowSize = () => {
  const isClient = typeof window === 'object'
  const [windowSize, setWindowSize] = useState({
    width: isClient ? window.innerWidth : undefined,
    height: isClient ? window.innerHeight : undefined
  })

  useEffect(() => {
    if (!isClient) return
    const handle = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      })
    }
    window.addEventListener('resize', handle)
    return () => {
      window.removeEventListener('resize', handle)
    }
  }, [isClient])

  return windowSize
}

export default useWindowSize
