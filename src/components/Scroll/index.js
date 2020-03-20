import React, { useState, useRef, useEffect } from 'react'
import BScroll from 'better-scroll'
import './index.scss'

const Scroll = props => {
  const { children } = props
  // eslint-disable-next-line
  const [scroll, setScroll] = useState()
  const scrollRef = useRef()

  useEffect(() => {
    const scrollInstance = new BScroll(scrollRef.current, { click: true })
    setScroll(scrollInstance)
    // console.log(scroll)
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
