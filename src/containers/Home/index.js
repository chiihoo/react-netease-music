import React from 'react'
import HomeHeader from '../../components/HomeHeader'
import { renderRoutes } from 'react-router-config'
import './index.scss'

const Home = ({ route }) => {
  return (
    <div className="Home">
      <HomeHeader />
      <div className="scroll-wrap">{renderRoutes(route.routes)}</div>
      {/* 左侧滑动边栏 */}
      {/* <div className="left-side-bar"></div> */}
    </div>
  )
}
export default React.memo(Home)
