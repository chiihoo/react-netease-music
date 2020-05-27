import { useEffect, useRef, useCallback } from 'react'
import { debounce } from 'lodash-es'
import { isPC } from '../utils/tools'

// Chrome调试模式 PC端与移动端互相切换时，swiper无法滑动，需要手动刷新
const useDeviceChangeReload = () => {
  const prevDeviceRef = useRef(isPC() ? 'PC' : 'Mobile')

  const resizeHandler = useCallback(
    debounce(() => {
      const currDevice = isPC() ? 'PC' : 'Mobile'
      if (prevDeviceRef.current !== currDevice) {
        window.location.reload()
      }
      prevDeviceRef.current = currDevice
    }, 100),
    []
  )

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  })
}

export default useDeviceChangeReload
