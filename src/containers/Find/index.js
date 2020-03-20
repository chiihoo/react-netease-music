import React, { useEffect, useState } from 'react'
import Scroll from '../../components/Scroll'
import Slider from '../../components/Slider'
import { getBannerRequest } from '../../api'
import { Link, useHistory } from 'react-router-dom'
import './index.scss'
import 'swiper/css/swiper.css'

const Find = () => {
  const [bannerList, setBannerList] = useState()
  useEffect(() => {
    ;(async () => {
      const bannerData = await getBannerRequest()
      setBannerList(bannerData.banners)
    })()
  }, [])
  const history = useHistory()
  return (
    <Scroll>
      <div className="Find">
        {bannerList && <Slider bannerList={bannerList}></Slider>}
        <div className="Find-nav">
          <Link to="/recommend/taste">
            <i className="iconfont icon-rili"></i>
            <span>每日推荐</span>
          </Link>
          <Link to="/playlist">
            <i className="iconfont icon-gedan"></i>
            <span>歌单</span>
          </Link>
          <Link to="/toplist">
            <i className="iconfont icon-paihangbang"></i>
            <span>排行榜</span>
          </Link>
          <Link to="/radio">
            <i className="iconfont icon-diantai"></i>
            <span>电台</span>
          </Link>
        </div>
      </div>
    </Scroll>
  )
}

export default React.memo(Find)
