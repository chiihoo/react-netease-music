import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { useInterval } from '@/hooks'
import './index.scss'

// 云村热评墙导航卡片
const HotwallNav = props => {
  // text-marquee类 从上往下轮播，当前显示项的index
  const [currentIndex, setCurrentIndex] = useState(0)

  const { hotwallNavList } = props

  // 周期性currentIndex+1，到最后就又从0开始
  useInterval(() => {
    const nextIndex = (currentIndex + 1) % hotwallNavList.length
    setCurrentIndex(nextIndex)
  }, 3000)

  // 这里不需要用useMemo，因为只有当currentIndex变化时，或者数据源改变时，它才会计算
  // 用了和没用的效果是一样的，用了反而还要多一次判断（检测依赖性是否改变）
  const currentItem = hotwallNavList[currentIndex]

  const month = Date().slice(4, 7) + '.'
  const day = Date().slice(8, 10)

  return (
    <div className="HotwallNav">
      <div
        className="hotwall-bg-img"
        style={{
          backgroundImage: `url(${currentItem.songCoverUrl})`
        }}
      ></div>
      <Link to="/hotwall">
        <div className="left-side">
          <div className="title">
            <span>云村热评墙</span>
            <i className="iconfont icon-gengduo"></i>
          </div>
          <div className="text-marquee">
            <TransitionGroup>
              <CSSTransition timeout={500} classNames="marquee-wrapper" key={currentItem.id}>
                <div className="content-wrapper">
                  <img className="avatar" src={currentItem.avatar} alt="avatar" />
                  <p className="content">{currentItem.content}</p>
                </div>
              </CSSTransition>
            </TransitionGroup>
          </div>
        </div>
        <div className="right-side">
          <span className="month">{month}</span>
          <span className="day">{day}</span>
        </div>
      </Link>
    </div>
  )
}

export default React.memo(HotwallNav)
