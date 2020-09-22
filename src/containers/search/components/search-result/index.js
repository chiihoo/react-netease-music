import React, { useState, useRef, useEffect } from 'react'
import Swiper from 'react-id-swiper'
import classNames from 'classnames'
import './index.scss'

// 搜索结果
const SearchResult = props => {
  const { columnsData } = props

  const tabListRef = useRef([]) // tab标签的ref集合
  const swiperRef = useRef()  
  const navListRef = useRef() // tab标签的父盒子，主要用于滚动

  const [activeIndex, setActiveIndex] = useState(0) // 当前选中tabs的index
  const [inkBarStyle, setInkBarStyle] = useState({ left: 0, width: 0 }) // tabs-ink-bar，即下方的红色长条的位置和大小

  // 需要设置初始tab标签的位置和大小
  useEffect(() => {
    setInkBarStyle({
      left: tabListRef.current[0].offsetLeft,
      width: tabListRef.current[0].offsetWidth
    })
  }, [])

  // react-id-swiper的传入参数
  const params = {
    resistanceRatio: 0,
    speed: 200,
    on: {
      // swiper切换页面时，设置当前活动页activeIndex
      slideChange: function () {
        setActiveIndex(this.activeIndex)
      }
    }
  }

  // 只要activeIndex改变，就设置当前ink-bar的位置大小，以及跳转swiper到activeIndex所代表的页面
  useEffect(() => {
    setInkBarStyle({
      left: tabListRef.current[activeIndex].offsetLeft,
      width: tabListRef.current[activeIndex].offsetWidth
    })
    swiperRef.current.swiper.slideTo(activeIndex)
  }, [activeIndex])

  // 每次切换activeIndex时，都要把当前活动的tabs移动到父级盒子中间
  useEffect(() => {
    // 要使active的那个tab移动到父级盒子中间，需要用这个tab距离父级左侧边界的距离 + 自身的一半 - 盒子的一半宽度（不是overflow的实际宽度），计算结果即为要移动到的距离
    let toLeft =
      tabListRef.current[activeIndex].offsetLeft +
      tabListRef.current[activeIndex].offsetWidth / 2 -
      navListRef.current.offsetWidth / 2
    navListRef.current.scrollTo({
      left: toLeft,
      behavior: 'smooth'
    })
  }, [activeIndex])

  return (
    <div className="search-result">
      <div className="tabs-nav-wrapper">
        <div className="tabs-nav-list" ref={navListRef}>
          {columnsData.map((item, index) => (
            <div
              key={item.nickname}
              className={classNames('tabs-tab', {
                'tabs-tab-active': activeIndex === index
              })}
              onClick={() => setActiveIndex(index)}
              ref={ref => {
                tabListRef.current[index] = ref
              }}
            >
              {item.name}
            </div>
          ))}
          <div
            className="tabs-ink-bar tabs-ink-bar-animated"
            style={{ left: inkBarStyle.left, width: inkBarStyle.width }}
          ></div>
        </div>
      </div>
      <div className="tabs-content">
        <Swiper {...params} ref={swiperRef}>
          {columnsData.map(item => {
            return <div key={item.nickname}>{item.name}</div>
          })}
        </Swiper>
      </div>
    </div>
  )
}

export default React.memo(SearchResult)
