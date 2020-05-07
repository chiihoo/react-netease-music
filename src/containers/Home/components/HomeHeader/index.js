import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import './index.scss'

const HomeHeader = props => {
  // 首页swiper当前活动页的index，以及改变这个index存储的方法
  const { activeIndex, changeActiveIndex } = props

  return (
    <div className="home-header">
      <i className="iconfont icon-caidan"></i>
      <div className="tabs">
        <div
          className={classNames('tab', { active: activeIndex === 0 })}
          onClick={() => changeActiveIndex(0)}
        >
          我的
        </div>
        <div
          className={classNames('tab', { active: activeIndex === 1 })}
          onClick={() => changeActiveIndex(1)}
        >
          发现
        </div>
      </div>
      <Link to="/search">
        <i className="iconfont icon-sousuo"></i>
      </Link>
    </div>
  )
}
export default React.memo(HomeHeader)
