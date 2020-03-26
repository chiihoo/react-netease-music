import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from 'reselect'
import { actions } from './store'
import Scroll from '../../components/Scroll'
import Slider from '../../components/Slider'
import HotwallNav from '../../components/HotwallNav'
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
  const selectHotwallNavList = useMemo(
    () =>
      createSelector(
        state => state.Find.hotwallList,
        items =>
          items.map(item => ({
            id: item.id,
            content: item.content,
            avatar: item.simpleUserInfo.avatar,
            songCoverUrl: item.simpleResourceInfo.songCoverUrl
          }))
      ),
    []
  )
  const bannerList = useSelector(selectBannerList)
  const hotwallNavList = useSelector(selectHotwallNavList)

  useEffect(() => {
    dispatch(actions.fetchBannerList())
    dispatch(actions.fetchHotwallList())
  }, [dispatch])

  return (
    <Scroll>
      <div className="Find">
        {bannerList.length > 0 && <Slider bannerList={bannerList}></Slider>}
        <div className="find-nav">
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
        <div className="hotwall-nav">
          {/* {hotwallNavList.length > 0 && <HotwallNav hotwallNavList={hotwallNavList} />} */}
          <HotwallNav hotwallNavList={hotwallNavList} />
        </div>
      </div>
    </Scroll>
  )
}

export default React.memo(Find)
