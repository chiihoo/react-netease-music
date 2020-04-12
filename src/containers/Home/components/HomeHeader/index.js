import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'
import './index.scss'

const HomeHeader = props => {
  const { swiperIndex, changeSwiperIndex } = props

  return (
    <div>
      <div className="HomeHeader">
        <i className="iconfont icon-caidan"></i>
        <div className="tabs">
          <div
            className={classNames('tab', { active: swiperIndex === 0 })}
            onClick={() => changeSwiperIndex(0)}
          >
            我的
          </div>
          <div
            className={classNames('tab', { active: swiperIndex === 1 })}
            onClick={() => changeSwiperIndex(1)}
          >
            发现
          </div>
        </div>
        <Link to="/search">
          <i className="iconfont icon-sousuo"></i>
        </Link>
      </div>
    </div>
  )
}
export default React.memo(HomeHeader)
