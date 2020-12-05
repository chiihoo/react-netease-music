import React, { useState, useEffect, useRef } from 'react'
import Swiper from 'react-id-swiper'
import HomeHeader from './components/home-header'
import My from './my'
import Find from './find'
import Yuncun from './yun-cun'
import { useStores } from '@/stores'
import './index.scss'

// 初始显示的页面序号
const INITIAL_INDEX = 1

// 首页
const Home = () => {
  const { loginStore } = useStores()

  useEffect(() => {
    console.log('x')
    loginStore.getAccountInfo()
    // eslint-disable-next-line
  }, [loginStore.userId, loginStore.isLogin])

  // swiper实例
  const swiperRef = useRef()

  // swiper当前活动页的index
  const [activeIndex, setActiveIndex] = useState(INITIAL_INDEX)
  // 没切换到My页面，切换过去也只加载一次
  const [hasGoToMy, setHasGoToMy] = useState(false)
  // 没切换到Yuncun页面，切换过去也只加载一次
  const [hasGoToYuncun, setHasGoToYuncun] = useState(false)

  useEffect(() => {
    if (activeIndex === 0 && !hasGoToMy) {
      setHasGoToMy(true)
    }
  }, [activeIndex, hasGoToMy])
  useEffect(() => {
    if (activeIndex === 2 && !hasGoToYuncun) {
      setHasGoToYuncun(true)
    }
  }, [activeIndex, hasGoToYuncun])

  // 当HomeHeader组件的导航按钮点击导致activeIndex改变时，swiper要跳转到指定页面
  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(activeIndex)
    }
  }, [activeIndex])

  const params = {
    containerClass: 'home-swiper',
    initialSlide: INITIAL_INDEX,
    resistanceRatio: 0,
    speed: 200,
    on: {
      // swiper切换页面时，设置当前活动页activeIndex
      slideChange: function () {
        setActiveIndex(this.activeIndex)
      }
    }
  }

  return (
    <div className="home">
      <div className="home-header-wrapper">
        <HomeHeader setActiveIndex={setActiveIndex} activeIndex={activeIndex} />
      </div>
      <div className="home-main">
        <Swiper {...params} ref={swiperRef}>
          <div>{hasGoToMy && <My />}</div>
          <div>
            <Find />
          </div>
          <div>{hasGoToYuncun && <Yuncun />}</div>
        </Swiper>
      </div>
    </div>
  )
}
export default React.memo(Home)
