import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import './index.scss'

const HomeHeader = () => {
  const { pathname } = useLocation()
  return (
    <div>
      <div className="HomeHeader">
        <i className="iconfont icon-caidan"></i>
        <div className="tabs">
          <Link to="/home/my" className={classNames({ active: pathname === '/home/my' })}>
            我的
          </Link>
          <Link to="/home/find" className={classNames({ active: pathname === '/home/find' })}>
            发现
          </Link>
          <Link to="/home/yuncun" className={classNames({ active: pathname === '/home/yuncun' })}>
            云村
          </Link>
        </div>
        <i className="iconfont icon-sousuo"></i>
      </div>
    </div>
  )
}
export default React.memo(HomeHeader)
