import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import useInterval from '../../hooks/useInterval'
import './index.scss'

const HotwallNav = props => {
  const { hotwallNavList } = props
  // 类text-marquee从上往下轮播，当前显示的item和index
  const [currentItem, setCurrentItem] = useState()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (hotwallNavList) {
      setCurrentItem(hotwallNavList[currentIndex])
    }
  }, [hotwallNavList])

  useInterval(() => {
    const nextIndex = (currentIndex + 1) % hotwallNavList.length
    setCurrentItem(hotwallNavList[nextIndex])
    setCurrentIndex(nextIndex)
  }, 3000)

  const month = Date().slice(4, 7) + '.'
  const day = Date().slice(8, 10)

  return (
    <div
      className="HotwallNav"
      style={{
        backgroundImage: `url(${currentItem && currentItem.songCoverUrl})`
      }}
    >
      <Link to="/hotwall">
        <div className="left-side">
          <div className="title">
            <span>云村热评墙</span>
            <i className="iconfont icon-gengduo"></i>
          </div>
          <div className="text-marquee">
            <TransitionGroup>
              {currentItem && (
                <CSSTransition timeout={350} classNames="marquee-wrapper" key={currentItem.id}>
                  <div className="content-wrapper">
                    <img className="avatar" src={currentItem.avatar} alt="avatar" />
                    <span className="content">{currentItem.content}</span>
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
          </div>
        </div>
        <div className="right-side">
          <div className="month">{month}</div>
          <div className="day">{day}</div>
        </div>
      </Link>
    </div>
  )
}

export default React.memo(HotwallNav)
