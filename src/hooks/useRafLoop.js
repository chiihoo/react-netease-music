import { useEffect, useRef, useCallback } from 'react'

/**
 * 用于使用requestAnimationFrame，简称raf，参考react-use实现
 * @param {Function} callback 默认参数为timeDiff，每次运行的时间间隔
 * @param {Boolean} initialActive 初始是否运行raf
 * @returns {Array} [stopRaf, startRaf] 停止raf，开始raf
 */
const useRafLoop = (callback, initialActive = true) => {
  const callbackRef = useRef()
  const prevTimeRef = useRef()
  const rafIdRef = useRef()

  useEffect(() => {
    callbackRef.current = callback
  })

  const step = useCallback(time => {
    if (prevTimeRef.current) {
      const timeDiff = time - prevTimeRef.current
      callbackRef.current(timeDiff)
    }
    prevTimeRef.current = time
    rafIdRef.current = requestAnimationFrame(step)
  }, [])

  const stopRaf = useCallback(() => {
    rafIdRef.current && cancelAnimationFrame(rafIdRef.current)
    prevTimeRef.current = null
  }, [])

  const startRaf = useCallback(() => {
    rafIdRef.current = requestAnimationFrame(step)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (initialActive) {
      startRaf()
    }
    return () => stopRaf()
    // eslint-disable-next-line
  }, [])

  return [stopRaf, startRaf]
}

export default useRafLoop
