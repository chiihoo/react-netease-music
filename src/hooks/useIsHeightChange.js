import { useRef, useState, useEffect } from 'react'
import useEventListener from './useEventListener'
import { isPC } from '../utils/tools'

// 安卓移动端唤起输入法时，输入法的区域不占页面高度，此时固定在页面底部的元素会被顶起
// 可以通过页面高度来判断是否唤起了输入法
const useIsHeightChange = () => {
  const heightRef = useRef()
  const [isHeightChange, setIsHeightChange] = useState(false)

  useEffect(() => {
    heightRef.current = document.documentElement.clientHeight
  }, [])

  useEventListener('resize', () => {
    // 在移动端才做判断
    if (!isPC()) {
      setIsHeightChange(heightRef.current > document.documentElement.clientHeight)
    }
  })

  return isHeightChange
}

export default useIsHeightChange
