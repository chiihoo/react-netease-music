import React from 'react'
import Swiper from 'react-id-swiper'
import classNames from 'classnames'
import './index.scss'

// 轮播图组件
const Carousel = props => {
  const { bannerList } = props

  const params = {
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    rebuildOnUpdate: true // 组件更新时卸载并重新生成swiper
  }

  return (
    <div className="carousel">
      <Swiper {...params}>
        {bannerList.map(item => {
          return (
            <div key={item.bannerId}>
              <a href={item.url}>
                <div className="carousel-img-wrapper">
                  <img src={item.pic} alt="" className="carousel-img" />
                  <span
                    className={classNames('carousel-img-type-title', {
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

export default React.memo(Carousel)
