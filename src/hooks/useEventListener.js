import { useRef, useEffect } from 'react'

function useEventListener(eventName, handle, element = window) {
  const savedHandler = useRef()

  useEffect(() => {
    savedHandler.current = handle
  }, [handle])

  useEffect(() => {
    const isSupported = element && element.addEventListener
    if (!isSupported) return
    const eventListener = event => savedHandler.current(event)
    element.addEventListener(eventName, eventListener)
    return () => {
      element.removeEventListener(eventName, eventListener)
    }
  }, [eventName, element])
}

export default useEventListener
