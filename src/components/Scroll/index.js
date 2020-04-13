import React, { useState, useRef, useEffect } from 'react'
import BScroll from 'better-scroll'
import './index.scss'

// better-scroll封装的滚动组件
const Scroll = props => {
  const { children } = props
  // eslint-disable-next-line
  const [scroll, setScroll] = useState()
  const scrollRef = useRef()

  useEffect(() => {
    const scrollInstance = new BScroll(scrollRef.current, {
      click: true,
      mouseWheel: true
    })
    setScroll(scrollInstance)
    return () => {
      setScroll(null)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className="Scroll" ref={scrollRef}>
      {children}
    </div>
  )
}

export default React.memo(Scroll)
