import { useRef, useEffect } from 'react'

function useTimeout(callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  })

  useEffect(() => {
    if (delay !== null) {
      const id = setTimeout(() => savedCallback.current(), delay)
      return () => {
        clearTimeout(id)
      }
    }
  }, [delay])
}
export default useTimeout
