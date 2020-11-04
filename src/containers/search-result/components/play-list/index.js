import React, { useState } from 'react'
import { List, WindowScroller } from 'react-virtualized'
import { useHistory } from 'react-router-dom'
import Scroll from '@/components/scroll'
import { handleNumber } from '@/utils/tools'
import './index.scss'

// 搜索结果-歌单
const PlayList = props => {
  const { playlists, fetchMore, loadingStatus, hasLoaded, hasMore, keyword } = props

  const [scrollElement, setScrollElement] = useState()

  const history = useHistory()

  const scrollParams = {
    getScrollElement: setScrollElement,
    pullUp: {
      callback() {
        fetchMore('playList')
      },
      hasMore,
      loadingStatus
    }
  }

  const regex = new RegExp(keyword, 'gi')

  const rowRenderer = ({ key, index, style }) => {
    return (
      <div
        className="play-list-item"
        key={key}
        style={style}
        onClick={() => history.push(`/playlist/${playlists[index].id}`)}
      >
        <img src={playlists[index].coverImgUrl + '?param=200y200'} alt="" />
        <div className="item-text">
          <p
            className="item-name one-line-ellipsis"
            dangerouslySetInnerHTML={{
              __html: playlists[index].name.replace(
                regex,
                x => `<span class="keyword-highlight">${x}</span>`
              )
            }}
          ></p>
          <p className="item-info one-line-ellipsis">
            <span>{playlists[index].trackCount}首</span>
            <span>
              by {playlists[index]?.creator.nickname}，播放
              {handleNumber(playlists[index]?.playCount)}次
            </span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="search-result-play-list">
      {hasLoaded === false ? (
        <div className="loading">
          <img src={require('@/assets/svg-icons/loading.svg')} alt="" />
          <span>努力加载中...</span>
        </div>
      ) : (
        <Scroll {...scrollParams}>
          {playlists && (
            <WindowScroller scrollElement={scrollElement}>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  width={window.innerWidth}
                  rowCount={playlists.length}
                  rowHeight={window.innerWidth * 0.185}
                  rowRenderer={rowRenderer}
                />
              )}
            </WindowScroller>
          )}
        </Scroll>
      )}
    </div>
  )
}

export default React.memo(PlayList)
