import React from 'react'
import { useHistory } from 'react-router-dom'
import { List, WindowScroller } from 'react-virtualized'
import { handleNumber } from '@/utils/tools'
import SongItem from '@/components/SongItem'
import 'react-virtualized/styles.css'
import './index.scss'

// 歌单页面中部 歌单信息
const PlaylistDetail = props => {
  const { playlistData, songsData, scrollElement } = props

  const history = useHistory()

  const rowRenderer = ({ key, index, style }) => {
    return (
      <SongItem
        key={key}
        style={style}
        song={songsData.songs[index]}
        privilege={songsData.privileges[index]}
      >
        {index + 1}
      </SongItem>
    )
  }

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
