import React, { useState, useEffect, useCallback, useRef } from 'react'
import Swiper from 'react-id-swiper'
import HomeHeader from './components/home-header'
import Find from '../find'
import Yuncun from '../yun-cun'
import './index.scss'

// 首页
const Home = () => {
  // swiper实例
  const swiperRef = useRef()
  // swiper当前活动页的index
  const [activeIndex, setActiveIndex] = useState(1)
  // 没切换到Yuncun页面，切换过去也只加载一次
  const [hasGoToYuncun, sethasGoToToYuncun] = useState(false)

  useEffect(() => {
    if (activeIndex === 2 && !hasGoToYuncun) {
      sethasGoToToYuncun(true)
    }
  }, [activeIndex, hasGoToYuncun])

  // 当HomeHeader组件的导航按钮点击导致activeIndex改变时，swiper要跳转到指定页面
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(activeIndex)
    }
  }, [activeIndex])

  const handleActiveIndex = useCallback(index => setActiveIndex(index), [])

  const params = {
    containerClass: 'home-swiper',
    initialSlide: 1,
    resistanceRatio: 0,
    speed: 200,
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
      <div className="home-main">
        <Swiper {...params} ref={swiperRef}>
          <div>my</div>
          <div>
            <Find />
          </div>
          <div>{hasGoToYuncun && <Yuncun />}</div>
        </Swiper>
      </div>

      {/* 左侧滑动边栏 */}
      {/* <div className="left-side-bar"></div> */}
    </div>
  )
}
export default React.memo(Home)
