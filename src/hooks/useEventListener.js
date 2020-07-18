import { useRef, useEffect } from 'react'

// 参考https://github.com/alibaba/hooks/blob/master/packages/hooks/src/useEventListener/index.ts

const getTargetElement = (target, defaultElement) => {
  if (!target) {
    return defaultElement
  }
  if (typeof target === 'function') {
    return target()
  } else if ('current' in target) {
    return target.current
  } else {
    return target
  }
}

// ref指向dom元素的时候，千万不能直接把ref.current传进来，只能传ref，否则组件不重新渲染的话，传进来的ref.current一直是undefined
// 记住ref的用法，把dom的引用ref传进来，使用的时候才用ref.current
const useEventListener = (eventName, handler, element, options) => {
  const savedHandler = useRef()

  useEffect(() => {
    savedHandler.current = handler
  })

  useEffect(() => {
    const targetElement = getTargetElement(element, window)
    const isSupported = targetElement.addEventListener
    if (!isSupported) return

    const eventListener = event => savedHandler.current(event)

    targetElement.addEventListener(eventName, eventListener, {
      capture: options?.capture,
      once: options?.once,
      passive: options?.passive
    })
    return () => {
      targetElement.removeEventListener(eventName, eventListener, { capture: options?.capture })
    }
  }, [eventName, element, options])
}

export default useEventListener
