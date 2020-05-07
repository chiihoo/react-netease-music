import React from 'react'
import Swiper from 'react-id-swiper'
import classNames from 'classnames'
import './index.scss'

// 首页发现页面的轮播图组件
const Slider = props => {
  const { bannerList } = props

  const params = {
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    loop: true,
    nested: true, // 用于嵌套相同方向的swiper时，当切换到子swiper时停止父swiper的切换
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    rebuildOnUpdate: true // 组件更新时卸载并重新生成swiper
  }

  return (
    <div className="slider">
      <Swiper {...params}>
        {bannerList.map(item => {
          return (
            <div key={item.bannerId}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <div className="slider-img-wrapper">
                  <img src={item.pic} alt="" className="slider-img" />
                  <span
                    className={classNames('slider-img-type-title', {
                      'typeTitle-red': item.titleColor === 'red',
                      'typeTitle-blue': item.titleColor === 'blue'
                    })}
                  >
                    {item.typeTitle}
                  </span>
                </div>
              </a>
            </div>
          )
        })}
      </Swiper>
    </div>
  )
}

export default React.memo(Slider)
