import React from 'react'
import { Link } from 'react-router-dom'
import Swiper from 'react-id-swiper'
import PlaylistCoverImg from '@/components/playlist-cover-img'
import './index.scss'

// 歌单推荐导航卡片
const PlaylistRecommend = props => {
  const { playlists, title, intro, linkTo } = props

  const params = {
    slidesPerView: 'auto',
    resistanceRatio: 0,
    freeMode: true,
    freeModeSticky: true, //自动贴合
    freeModeMomentumBounce: false, //关闭动量反弹
    // spaceBetween: 8,  // 在这里设置无法自动转成vw，改写在.swiper-slide的padding中
    // slidesOffsetBefore: 15,  //在这里设置无法自动转成vw，改写在.swiper-container的padding中
    // slidesOffsetAfter: 15,
    // shouldSwiperUpdate: true, // 组件更新时更新swiper
    rebuildOnUpdate: true // 组件更新时卸载并重新生成swiper
  }

  return (
    <div className="playlist-recommend">
      <div className="header">
        <div className="header-left">
          <p className="title">{title}</p>
          <p className="intro">{intro}</p>
        </div>
        <Link to={linkTo} className="header-right">
          查看更多
        </Link>
      </div>
      <Swiper {...params}>
        {playlists.map(item => {
          return (
            <div key={item.id} className="playlist-item">
              <Link to={`/playlist/${item.id}`}>
                <div className="playlist-cover-img-wrapper">
                  <PlaylistCoverImg
                    coverImgUrl={item.coverImgUrl + '?param=200y200'}
                    name={item.name}
                    playCount={item.playCount}
                  />
                </div>
                <p className="desc two-lines-ellipsis">{item.name}</p>
              </Link>
            </div>
          )
        })}
      </Swiper>
    </div>
  )
}

export default React.memo(PlaylistRecommend)
