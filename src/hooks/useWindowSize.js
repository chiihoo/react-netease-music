import { useState, useEffect } from 'react'

function useWindowSize() {
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
