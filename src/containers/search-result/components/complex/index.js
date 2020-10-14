import React from 'react'
import Scroll from '@/components/scroll'
import SongItem from '../song-item'
import './index.scss'

const Complex = props => {
  const {
    song,
    keyword,
    handleComplexSongItemClick,
    hasLoaded,
    changeActiveIndexByNickname
  } = props

  return (
    <div className="search-result-complex">
      {hasLoaded === false ? (
        <div className="loading">
          <img src={require('@/assets/svg-icons/loading.svg')} alt="" />
          <span>努力加载中...</span>
        </div>
      ) : (
        <Scroll>
          <div className="song">
            <div className="song-header">
              <h4>单曲</h4>
              <div className="play-all">
                <i className="iconfont icon-bofang6"></i>
                <span>播放全部</span>
              </div>
            </div>
            <div>
              {song?.songs?.map((item, index) => (
                <SongItem
                  key={item.id}
                  song={item}
                  privilege={song.privileges[index]}
                  handleSongItemClick={handleComplexSongItemClick}
                  keyword={keyword}
                />
              ))}
            </div>
            <p
              onClick={() => {
                changeActiveIndexByNickname('song')
              }}
            >
              <span>{song?.moreText}</span>
              <i className="iconfont icon-gengduo"></i>
            </p>
          </div>
          <div className="play-list"></div>
          <div className="album"></div>
          <div className="dj-radio"></div>
          <div className="user"></div>
        </Scroll>
      )}
    </div>
  )
}

export default React.memo(Complex)
