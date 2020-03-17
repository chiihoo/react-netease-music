import React from 'react'
import HomeHeader from '../../components/HomeHeader'
import { renderRoutes } from 'react-router-config'

const Home = ({ route }) => {
  return (
    <div className="Home">
      <HomeHeader />
      {renderRoutes(route.routes)}
    </div>
  )
}
export default React.memo(Home)
