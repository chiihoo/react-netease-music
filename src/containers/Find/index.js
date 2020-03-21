import React, { useEffect, useMemo } from 'react'
import Scroll from '../../components/Scroll'
import Slider from '../../components/Slider'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from 'reselect'
import { actions } from './store'
import './index.scss'
import 'swiper/css/swiper.css'

const Find = props => {
  const dispatch = useDispatch()

  // Find是最上层store里面定义的 Find: FindReducer
  // const bannerList = useSelector(state => state.Find.bannerList)
  const selectBannerList = useMemo(
    () =>
      createSelector(
        state => state.Find.bannerList,
        items => items
      ),
    []
  )
  const bannerList = useSelector(selectBannerList)

  useEffect(() => {
    dispatch(actions.fetchBannerList())
  }, [dispatch])

  return (
    <Scroll>
      <div className="Find">
        {bannerList.length > 0 && <Slider bannerList={bannerList}></Slider>}
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
