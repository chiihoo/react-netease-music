import { useEffect, useRef } from 'react'
import useDebouncedCallback from './useDebouncedCallback'
import { isPC } from '../utils/tools'

// Chrome调试模式 PC端与移动端互相切换时，需要手动刷新，
// 本hooks监听设备为PC还是移动端，当首次切换到对方时，进行刷新
const useDeviceChangeReload = () => {
  const prevDeviceRef = useRef(isPC() ? 'PC' : 'Mobile')

  const resizeHandler = useDebouncedCallback(() => {
    const currDevice = isPC() ? 'PC' : 'Mobile'
    if (prevDeviceRef.current !== currDevice) {
      window.location.reload()
    }
    prevDeviceRef.current = currDevice
  }, 100)

  useEffect(() => {
    window.addEventListener('resize', resizeHandler)
    return () => window.removeEventListener('resize', resizeHandler)
  })
}

export default useDeviceChangeReload
