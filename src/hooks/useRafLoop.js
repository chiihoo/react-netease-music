import { useEffect, useRef, useCallback } from 'react'

/**
 * 用于使用requestAnimationFrame，简称raf，参考react-use实现
 * @param {Function} callback 默认参数为timeDiff，每次运行的时间间隔
 * @param {Boolean} initialActive 初始是否运行raf
 * @returns {Array} [stopRaf, startRaf] 停止raf，开始raf
 */
const useRafLoop = (callback, initialActive = true) => {
  const savedCallback = useRef()
  const prevTime = useRef()
  const rafId = useRef()
  const isActive = useRef(false)
  // 必须要用isActive上锁，这样在停止以后就不会继续调用step函数内的requestAnimationFrame(step)
  // 我之前没有用，有时候会报错：在卸载的组件中试图更新state，但实际上我都已经把异步操作在return中清除掉了
  // Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.
  // react-use库是用的这种方式，可能是stopRaf并没有全部关掉，仍然进行了requestAnimationFrame(step)请求

  useEffect(() => {
    savedCallback.current = callback
  })

  const step = useCallback(time => {
    if (isActive.current) {
      if (prevTime.current) {
        const timeDiff = time - prevTime.current
        savedCallback.current(timeDiff)
      }
      prevTime.current = time
      rafId.current = requestAnimationFrame(step)
    }
  }, [])

  const stopRaf = useCallback(() => {
    if (isActive.current) {
      isActive.current = false
      rafId.current && cancelAnimationFrame(rafId.current)
      prevTime.current = null
    }
  }, [])

  const startRaf = useCallback(() => {
    if (!isActive.current) {
      isActive.current = true
      rafId.current = requestAnimationFrame(step)
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (initialActive) {
      startRaf()
    }
    return () => stopRaf()
    // eslint-disable-next-line
  }, [])

  return [stopRaf, startRaf, isActive.current]
}

export default useRafLoop
