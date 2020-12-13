import React, { useState } from 'react'
import { List, WindowScroller } from 'react-virtualized'
import Scroll from '@/components/scroll'
import { formatTimeToDate, hasNotDoneToast } from '@/utils/tools'
import './index.scss'

// 搜索结果-专辑
const Album = props => {
  const { albums, fetchMore, loadingStatus, hasMore, keyword } = props

  const [scrollElement, setScrollElement] = useState()

  const scrollParams = {
    getScrollElement: setScrollElement,
    pullUp: {
      callback() {
        fetchMore('album')
      },
      hasMore,
      loadingStatus
    }
  }

  const regex = new RegExp(keyword, 'gi')

  const rowRenderer = ({ key, index, style }) => {
    return (
      <div className="album-item" key={key} style={style} onClick={hasNotDoneToast}>
        <img src={albums[index].picUrl + '?param=200y200'} alt="" />
        <div className="item-text">
          <p
            className="item-name one-line-ellipsis"
            dangerouslySetInnerHTML={{
              __html: albums[index].name.replace(
                regex,
                x => `<span class="keyword-highlight">${x}</span>`
              )
            }}
          ></p>
          <p className="item-info one-line-ellipsis">
            <span>
              {albums[index]?.artists.reduce((total, artist, index, arr) => {
                return index !== arr.length - 1
                  ? total + artist.name + '/'
                  : total + artist.name + ' '
              }, '')}
              {formatTimeToDate(albums[index].publishTime)}
            </span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="search-result-album">
      <Scroll {...scrollParams}>
        {albums && (
          <WindowScroller scrollElement={scrollElement}>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
              <List
                autoHeight
                height={height}
                isScrolling={isScrolling}
                onScroll={onChildScroll}
                scrollTop={scrollTop}
                width={window.innerWidth}
                rowCount={albums.length}
                rowHeight={window.innerWidth * 0.185}
                rowRenderer={rowRenderer}
              />
            )}
          </WindowScroller>
        )}
      </Scroll>
    </div>
  )
}

export default React.memo(Album)
