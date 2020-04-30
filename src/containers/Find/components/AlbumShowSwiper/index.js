import React from 'react'
import Swiper from 'react-id-swiper'
import './index.scss'

// 新歌新碟卡片中 —— 新碟滑动展示区域
const AlbumShowSwiper = props => {
  const { data } = props

  const params = {
    resistanceRatio: 0,
    shouldSwiperUpdate: true
  }

  return (
    <div className="AlbumShowSwiper">
      <Swiper {...params}>
        {data.map(itemArr => {
          return (
            <div key={itemArr[0].id}>
              {itemArr.map(item => {
                return (
                  <div className="item-info" key={item.id}>
                    <img src={item.picUrl} alt={item.name} className="item-cover-img" />
                    <div className="item-main">
                      <div className="item-desc">
                        <p className="title">
                          {item.name}
                          {item.alias.length > 0 && `（${item.alias[0]}）`}
                        </p>
                        <p className="artists">
                          {item.artists.reduce((total, currentValue, currentIndex, arr) => {
                            return currentIndex === arr.length - 1
                              ? total + currentValue.name
                              : total + currentValue.name + '/'
                          }, '- ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </Swiper>
    </div>
  )
}

export default React.memo(AlbumShowSwiper)
