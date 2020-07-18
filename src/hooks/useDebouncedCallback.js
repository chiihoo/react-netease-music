import { useRef, useEffect, useCallback } from 'react'

const useDebouncedCallback = (callback, delay, immediate = false) => {
  const savedCallback = useRef()
  const timerId = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  const debouncedCallback = useCallback(
    (...args) => {
      if (!immediate) {
        // 非立即执行版本
        timerId.current && clearTimeout(timerId.current)
        timerId.current = setTimeout(() => savedCallback.current.call(this, ...args), delay)
      } else {
        // 立即执行版本
        timerId.current ? clearTimeout(timerId.current) : savedCallback.current.call(this, ...args)
        timerId.current = setTimeout(() => {
          timerId.current = null
        })
      }
    },
    [delay, immediate]
  )

  return debouncedCallback
}

export default useDebouncedCallback
