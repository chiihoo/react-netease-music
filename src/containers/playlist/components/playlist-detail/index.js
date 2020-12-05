import React from 'react'
import { useHistory } from 'react-router-dom'
import { List, WindowScroller } from 'react-virtualized'
import { handleNumber } from '@/utils/tools'
import SongItem from '../song-item'
import './index.scss'

// 歌单页面中部 歌单信息
const PlaylistDetail = React.forwardRef((props, ref) => {
  const {
    trackCount,
    subscribers,
    subscribedCount,
    songs,
    privileges,
    scrollElement,
    handleSongItemClick,
    handlePlayAllClick,
    currentSongId
  } = props

  const history = useHistory()

  const rowRenderer = ({ key, index, style }) => {
    return (
      <SongItem
        key={key}
        style={style}
        song={songs[index]}
        privilege={privileges[index]}
        handleSongItemClick={handleSongItemClick}
      >
        {currentSongId === songs[index].id ? <i className="iconfont icon-laba"></i> : index + 1}
      </SongItem>
    )
  }

  return (
    <div className="playlist-detail">
      <div className="playlist-detail-nav" ref={ref}>
        <div className="playlist-play-all" onClick={handlePlayAllClick}>
          <i className="iconfont icon-bofang6"></i>
          <span>播放全部</span>
          <span>(共{trackCount}首)</span>
        </div>
        <div className="subscribe-btn">
          <i className="iconfont icon-jiahao"></i>
          <span>收藏</span>
          <span>({handleNumber(subscribedCount)})</span>
        </div>
      </div>
      <div className="playlist-detail-songs">
        {songs && (
          <WindowScroller scrollElement={scrollElement}>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <List
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                width={window.innerWidth}
                rowCount={songs.length}
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
          {subscribers?.slice(0, 5).map(item => (
            <img
              src={item.avatarUrl + '?param=200y200'}
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
        <span className="subscribed-count">{handleNumber(subscribedCount)}人收藏</span>
      </div>
    </div>
  )
})

export default React.memo(PlaylistDetail)
