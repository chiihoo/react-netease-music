import React, { useState } from 'react'
import { List, WindowScroller } from 'react-virtualized'
import Scroll from '@/components/scroll'
import SongItem from '../song-item'
import './index.scss'

// 搜索结果
const Song = props => {
  const {
    songs,
    privileges,
    handleSongItemClick,
    handlePlayAllClick,
    fetchMore,
    loadingStatus,
    hasLoaded,
    hasMore,
    keyword
  } = props

  const [scrollElement, setScrollElement] = useState()

  const scrollParams = {
    getScrollElement: setScrollElement,
    pullUp: {
      callback() {
        fetchMore('song')
      },
      hasMore,
      loadingStatus
    }
  }

  const rowRenderer = ({ key, index, style }) => {
    return (
      <SongItem
        key={key}
        style={style}
        song={songs[index]}
        privilege={privileges[index]}
        handleSongItemClick={handleSongItemClick}
        keyword={keyword}
      />
    )
  }

  return (
    <div className="search-result-song">
      {hasLoaded === false ? (
        <div className="loading">
          <img src={require('@/assets/svg-icons/loading.svg')} alt="" />
          <span>努力加载中...</span>
        </div>
      ) : (
        <Scroll {...scrollParams}>
          <div className="search-result-song-header">
            <div className="play-all" onClick={handlePlayAllClick}>
              <i className="iconfont icon-bofang6"></i>
              <span>播放全部</span>
            </div>
            <div className="multiple-choice">
              <i className="iconfont icon-caidan3"></i>
              <span>多选</span>
            </div>
          </div>
          <div className="result-songs">
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
        </Scroll>
      )}
    </div>
  )
}

export default React.memo(Song)
