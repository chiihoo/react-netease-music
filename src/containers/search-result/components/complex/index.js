import React from 'react'
import { useHistory } from 'react-router-dom'
import Scroll from '@/components/scroll'
import SongItem from '../song-item'
import { handleNumber, formatTime, formatTimeToDate, hasNotDoneToast } from '@/utils/tools'

import './index.scss'

// 搜索结果-综合
const Complex = props => {
  const {
    song,
    playList,
    video,
    artist,
    album,
    djRadio,
    user,
    keyword,
    handleComplexSongItemClick,
    changeActiveIndexByNickname
  } = props

  const history = useHistory()

  const regex = new RegExp(keyword, 'gi')

  return (
    <div className="search-result-complex">
      <Scroll>
        {song?.songs.length > 0 && (
          <div className="song">
            <div className="song-header">
              <h4>单曲</h4>
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
            {song?.more && (
              <p
                className="find-more"
                onClick={() => {
                  changeActiveIndexByNickname('song')
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: song?.moreText.replace(
                      regex,
                      x => `<span class="keyword-highlight">${x}</span>`
                    )
                  }}
                ></span>
                <i className="iconfont icon-gengduo"></i>
              </p>
            )}
          </div>
        )}
        {playList?.playLists.length > 0 && (
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
            {playList?.more && (
              <p
                className="find-more"
                onClick={() => {
                  changeActiveIndexByNickname('playList')
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: playList?.moreText.replace(
                      regex,
                      x => `<span class="keyword-highlight">${x}</span>`
                    )
                  }}
                ></span>
                <i className="iconfont icon-gengduo"></i>
              </p>
            )}
          </div>
        )}
        {video?.videos?.length > 0 && (
          <div className="video">
            <h4>视频</h4>
            {video?.videos?.map(item => (
              <div className="video-item" key={item.vid} onClick={hasNotDoneToast}>
                <div className="video-img">
                  <img src={item.coverUrl} alt="" />
                  <div className="play-count">
                    <i className="iconfont icon-yousanjiao"></i>
                    <span>{handleNumber(item.playTime)}</span>
                  </div>
                </div>
                <div className="item-text">
                  <p
                    className="item-name"
                    dangerouslySetInnerHTML={{
                      __html: item.title.replace(
                        regex,
                        x => `<span class="keyword-highlight">${x}</span>`
                      )
                    }}
                  ></p>
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
            {video?.more && (
              <p
                className="find-more"
                onClick={() => {
                  changeActiveIndexByNickname('video')
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: video?.moreText.replace(
                      regex,
                      x => `<span class="keyword-highlight">${x}</span>`
                    )
                  }}
                ></span>
                <i className="iconfont icon-gengduo"></i>
              </p>
            )}
          </div>
        )}
        {artist?.artists?.length > 0 && (
          <div className="artist">
            <h4>歌手</h4>
            {artist?.artists?.map(item => (
              <div className="artist-item" key={item.id} onClick={hasNotDoneToast}>
                <img
                  src={
                    item.picUrl
                      ? item.picUrl + '?param=200y200'
                      : 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg?param=200y200'
                  }
                  alt=""
                />
                <p
                  className="item-name one-line-ellipsis"
                  dangerouslySetInnerHTML={{
                    __html: item.name.replace(
                      regex,
                      x => `<span class="keyword-highlight">${x}</span>`
                    )
                  }}
                ></p>
              </div>
            ))}
            {artist?.more && (
              <p
                className="find-more"
                onClick={() => {
                  changeActiveIndexByNickname('artist')
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: artist?.moreText.replace(
                      regex,
                      x => `<span class="keyword-highlight">${x}</span>`
                    )
                  }}
                ></span>
                <i className="iconfont icon-gengduo"></i>
              </p>
            )}
          </div>
        )}
        {album?.albums?.length > 0 && (
          <div className="album">
            <h4>专辑</h4>
            {album?.albums?.map(item => (
              <div className="album-item" key={item.id} onClick={hasNotDoneToast}>
                <img src={item.picUrl + '?param=200y200'} alt="" />
                <div className="item-text">
                  <p
                    className="item-name one-line-ellipsis"
                    dangerouslySetInnerHTML={{
                      __html: item.name.replace(
                        regex,
                        x => `<span class="keyword-highlight">${x}</span>`
                      )
                    }}
                  ></p>
                  <p className="item-info one-line-ellipsis">
                    <span>
                      {item?.artists.reduce((total, artist, index, arr) => {
                        return index !== arr.length - 1
                          ? total + artist.name + '/'
                          : total + artist.name + ' '
                      }, '')}
                      {formatTimeToDate(item.publishTime)}
                    </span>
                  </p>
                </div>
              </div>
            ))}
            {album?.more && (
              <p
                className="find-more"
                onClick={() => {
                  changeActiveIndexByNickname('album')
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: album?.moreText.replace(
                      regex,
                      x => `<span class="keyword-highlight">${x}</span>`
                    )
                  }}
                ></span>
                <i className="iconfont icon-gengduo"></i>
              </p>
            )}
          </div>
        )}
        {djRadio?.djRadios?.length > 0 && (
          <div className="dj-radio">
            <h4>专辑</h4>
            {djRadio?.djRadios?.map(item => (
              <div className="dj-radio-item" key={item.id} onClick={hasNotDoneToast}>
                <img src={item?.picUrl + '?param=200y200'} alt="" />
                <div className="item-text">
                  <p
                    className="item-name one-line-ellipsis"
                    dangerouslySetInnerHTML={{
                      __html: item?.name.replace(
                        regex,
                        x => `<span class="keyword-highlight">${x}</span>`
                      )
                    }}
                  ></p>
                  <p className="item-info one-line-ellipsis">
                    <span>{item?.dj?.nickname}</span>
                  </p>
                </div>
              </div>
            ))}
            {djRadio?.more && (
              <p
                className="find-more"
                onClick={() => {
                  changeActiveIndexByNickname('djRadio')
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: djRadio?.moreText.replace(
                      regex,
                      x => `<span class="keyword-highlight">${x}</span>`
                    )
                  }}
                ></span>
                <i className="iconfont icon-gengduo"></i>
              </p>
            )}
          </div>
        )}
        {user?.users?.length > 0 && (
          <div className="user">
            <h4>用户</h4>
            {user?.users?.map(item => (
              <div className="user-item" key={item.userId} onClick={hasNotDoneToast}>
                <img
                  src={
                    item.avatarUrl
                      ? item.avatarUrl + '?param=200y200'
                      : 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg?param=200y200'
                  }
                  alt=""
                />
                <div className="item-text">
                  <p className="item-name one-line-ellipsis">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: item.nickname.replace(
                          regex,
                          x => `<span class="keyword-highlight">${x}</span>`
                        )
                      }}
                    ></span>
                    {item.gender === 1 && <i className="iconfont icon-nan"></i>}
                    {item.gender === 2 && <i className="iconfont icon-nv"></i>}
                  </p>
                  {item?.signature && (
                    <p className="item-info one-line-ellipsis">{item?.signature}</p>
                  )}
                </div>
              </div>
            ))}
            {user?.more && (
              <p
                className="find-more"
                onClick={() => {
                  changeActiveIndexByNickname('user')
                }}
              >
                <span
                  dangerouslySetInnerHTML={{
                    __html: user?.moreText.replace(
                      regex,
                      x => `<span class="keyword-highlight">${x}</span>`
                    )
                  }}
                ></span>
                <i className="iconfont icon-gengduo"></i>
              </p>
            )}
          </div>
        )}
      </Scroll>
    </div>
  )
}

export default React.memo(Complex)
