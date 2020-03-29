import React from 'react'
import Swiper from 'react-id-swiper'
import classNames from 'classnames'
import './index.scss'
import 'swiper/css/swiper.css'

const Slider = props => {
  const { bannerList } = props

  const params = {
    autoplay: true,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    observer: true,
    observeParents: true
  }

  return (
    <div className="Slider">
      <Swiper {...params}>
        {bannerList.map((item, index) => {
          return (
            <div key={item.bannerId}>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <div className="slider-img-wrapper">
                  <img src={item.pic} alt="" className="slider-img" />
                  <span
                    className={classNames('slider-img-typeTitle', {
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
