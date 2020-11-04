import React from 'react'
import { useHistory } from 'react-router-dom'
import Scroll from '@/components/scroll'
import SongItem from '../song-item'
import { handleNumber, formatTime } from '@/utils/tools'
import './index.scss'

// 搜索结果-综合
const Complex = props => {
  const {
    song,
    playList,
    video,
    keyword,
    handleComplexSongItemClick,
    hasLoaded,
    changeActiveIndexByNickname
  } = props

  const history = useHistory()

  const regex = new RegExp(keyword, 'gi')

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
          <div className="play-list">
            <h4>歌单</h4>
            {playList?.playLists?.map(item => (
              <div
                key={item.id}
                className="play-list-item"
                onClick={() => history.push(`/playlist/${item.id}`)}
              >
                <img src={item.coverImgUrl + '?param=200y200'} alt="" />
                <div className="item-text">
                  {/* <p className="item-name">{item.name}</p> */}
                  <p
                    className="item-name"
                    dangerouslySetInnerHTML={{
                      __html: item.name.replace(
                        regex,
                        x => `<span class="keyword-highlight">${x}</span>`
                      )
                    }}
                  ></p>
                  <p className="item-info one-line-ellipsis">
                    <span>{item.trackCount}首</span>
                    <span>
                      by {item?.creator.nickname}，播放{handleNumber(item?.playCount)}次
                    </span>
                  </p>
                </div>
              </div>
            ))}
            <p
              onClick={() => {
                changeActiveIndexByNickname('playList')
              }}
            >
              <span>{playList?.moreText}</span>
              <i className="iconfont icon-gengduo"></i>
            </p>
          </div>
          <div className="video">
            <h4>视频</h4>
            {video?.videos?.map(item => (
              <div className="video-item" key={item.vid}>
                <div className="video-img">
                  <img src={item.coverUrl} alt="" />
                  <div className="play-count">
                    <i className="iconfont icon-yousanjiao"></i>
                    <span>{handleNumber(item.playTime)}</span>
                  </div>
                </div>
                <div className="item-text">
                  <p className="item-name">{item.title}</p>
                  <p className="item-info one-line-ellipsis">
                    <span>{formatTime(item.durationms / 1000)}</span>
                    <span>
                      {item?.creator?.reduce((total, curr, index, arr) => {
                        return index !== arr.length - 1
                          ? total + curr.userName + '/'
                          : total + curr.userName
                      }, 'by ')}
                    </span>
                  </p>
                </div>
              </div>
            ))}
            <p
              onClick={() => {
                changeActiveIndexByNickname('video')
              }}
            >
              <span>{video?.moreText}</span>
              <i className="iconfont icon-gengduo"></i>
            </p>
          </div>
          <div className="album"></div>
          <div className="dj-radio"></div>
          <div className="user"></div>
        </Scroll>
      )}
    </div>
  )
}

export default React.memo(Complex)
