import React, { useCallback } from 'react'
import classNames from 'classnames'
import { useHistory } from 'react-router-dom'
import { List, WindowScroller } from 'react-virtualized'
import { handleNumber } from '@/utils/tools'
import 'react-virtualized/styles.css'
import './index.scss'

// 歌单页面中部 歌单信息
const PlaylistDetail = props => {
  const { playlistData, songsData, scrollElement } = props

  const history = useHistory()

  const rowRenderer = useCallback(
    ({ key, index, style }) => {
      const { songs, privileges } = songsData

      const song = songs[index]
      const privilege = privileges[index]
      // console.log(songsData.songs.length)
      return (
        <div className="song-item" key={key} style={style}>
          <div className="left">{index + 1}</div>
          <div className="main">
            {/* off-the-shelf 下架 */}
            <p
              className={classNames('title', 'one-line-ellipsis', {
                'off-the-shelf': privilege < 0
              })}
            >
              {song.name}
            </p>
            <p className="info">
              {/* VIP */}
              {privilege.fee === 1 && <i className="iconfont icon-VIP"></i>}
              {/* 试听 */}
              {/1152|1028|1088|1092/.test(privilege.flag) && (
                <i className="iconfont icon-shiting"></i>
              )}
              {/* 独家 */}
              {/64|68|1088|1092/.test(privilege.flag) && <i className="iconfont icon-dujia"></i>}
              {/* SQ */}
              {privilege.maxbr === 999000 && <i className="iconfont icon-SQ"></i>}
              <span
                className={classNames('artist-album-name', 'one-line-ellipsis', {
                  'off-the-shelf': privilege < 0
                })}
              >
                {song?.ar.reduce((total, artist, index, arr) => {
                  return index !== arr.length - 1
                    ? total + artist.name + '/'
                    : total + artist.name + ' - '
                }, '')}
                {song.al.name}
              </span>
            </p>
          </div>
          <div className="right">
            <i className="iconfont icon-mv1"></i>
            <i className="iconfont icon-more"></i>
          </div>
        </div>
      )
    },
    [songsData]
  )

  return (
    <div className="playlist-detail">
      <div className="playlist-detail-nav">
        <div className="playlist-play-all">
          <i className="iconfont icon-bofang6"></i>
          <span>播放全部</span>
          <span>(共{playlistData.trackCount}首)</span>
        </div>
        <div className="subscribe-btn">
          <i className="iconfont icon-jiahao"></i>
          <span>收藏</span>
          <span>({handleNumber(playlistData.subscribedCount)})</span>
        </div>
      </div>
      <div className="playlist-detail-songs">
        {songsData.songs && (
          <WindowScroller scrollElement={scrollElement}>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <List
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                width={window.innerWidth}
                rowCount={songsData.songs.length}
                rowHeight={window.innerWidth * 0.14133}
                rowRenderer={rowRenderer}
              />
            )}
          </WindowScroller>
        )}
      </div>
      <div
        className="playlist-detail-subscribers"
        onClick={() => {
          history.push('/playlist/subscribers')
        }}
      >
        <div className="avatar-list">
          {playlistData.subscribers?.slice(0, 5).map(item => (
            <img
              src={item.avatarUrl}
              alt=""
              className="avatar"
              key={item.userId}
              onClick={e => {
                e.stopPropagation()
                history.push(`/user/${item.userId}`)
              }}
            />
          ))}
        </div>
        <span className="subscribed-count">{handleNumber(playlistData.subscribedCount)}人收藏</span>
      </div>
    </div>
  )
}

export default React.memo(PlaylistDetail)
