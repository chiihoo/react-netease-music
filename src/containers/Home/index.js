import React, { useState, useEffect, useCallback } from 'react'
import Swiper from 'react-id-swiper'
import Scroll from '@/components/Scroll'
import HomeHeader from './components/HomeHeader'
import Find from '../Find'
import './index.scss'

const Home = () => {
  const [swiper, setSwiper] = useState()
  const [swiperIndex, setSwiperIndex] = useState(1)

  useEffect(() => {
    if (swiper) {
      swiper.slideTo(swiperIndex)
    }
  }, [swiper, swiperIndex])

  const handleSwiperIndex = useCallback(index => setSwiperIndex(index), [])

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
      transitionEnd: function () {
        setSwiperIndex(this.activeIndex)
      }
    }
  }

  return (
    <div className="Home">
      <HomeHeader changeSwiperIndex={handleSwiperIndex} swiperIndex={swiperIndex} />
      <div className="scroll-wrap">
        <Swiper {...params}>
          <div>my</div>
          <div>
            <Scroll>
              <Find />
            </Scroll>
          </div>
        </Swiper>
      </div>

      {/* 左侧滑动边栏 */}
      {/* <div className="left-side-bar"></div> */}
    </div>
  )
}
export default React.memo(Home)
