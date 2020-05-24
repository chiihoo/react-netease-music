import { useRef, useEffect } from 'react'

function useEventListener(eventName, handler, element = window, options) {
  const savedHandler = useRef()

  useEffect(() => {
    savedHandler.current = handler
  })

  useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return
    const eventListener = event => savedHandler.current(event)
    element.addEventListener(eventName, eventListener, {
      capture: options?.capture,
      once: options?.once,
      passive: options?.passive
    })
    return () => {
      element.removeEventListener(eventName, eventListener, { capture: options?.capture })
    }
  }, [eventName, element, options])
}

export default useEventListener
