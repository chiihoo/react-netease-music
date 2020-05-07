import React, { useState, useEffect, useCallback } from 'react'
import Swiper from 'react-id-swiper'
import HomeHeader from './components/HomeHeader'
import Find from '../Find'
import './index.scss'

// 首页
const Home = () => {
  // swiper实例
  const [swiper, setSwiper] = useState()
  // swiper当前活动页的index
  const [activeIndex, setActiveIndex] = useState(1)

  // 当HomeHeader组件的导航按钮点击导致activeIndex改变时，swiper要跳转到指定页面
  useEffect(() => {
    if (swiper) {
      swiper.slideTo(activeIndex)
    }
  }, [swiper, activeIndex])

  const handleActiveIndex = useCallback(index => setActiveIndex(index), [])

  const params = {
    containerClass: 'home-swiper',
    initialSlide: 1,
    resistanceRatio: 0,
    speed: 200,
    observer: true,
    observeParents: true,
    watchSlidesProgress: true,
    getSwiper: setSwiper,
    on: {
      // swiper切换页面后，设置当前活动页index
      transitionEnd: function () {
        setActiveIndex(this.activeIndex)
      }
    }
  }

  return (
    <div className="home">
      <HomeHeader changeActiveIndex={handleActiveIndex} activeIndex={activeIndex} />
      <div className="scroll-wrapper">
        <Swiper {...params}>
          <div>my</div>
          <div>
            <Find />
          </div>
        </Swiper>
      </div>

      {/* 左侧滑动边栏 */}
      {/* <div className="left-side-bar"></div> */}
    </div>
  )
}
export default React.memo(Home)
