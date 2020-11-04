import React, { useState } from 'react'
import { List, WindowScroller } from 'react-virtualized'
import Scroll from '@/components/scroll'
import './index.scss'

// 搜索结果-歌手
const Artist = props => {
  const { artists, fetchMore, loadingStatus, hasLoaded, hasMore, keyword } = props

  const [scrollElement, setScrollElement] = useState()

  const scrollParams = {
    getScrollElement: setScrollElement,
    pullUp: {
      callback() {
        fetchMore('artist')
      },
      hasMore,
      loadingStatus
    }
  }

  const regex = new RegExp(keyword, 'gi')

  const rowRenderer = ({ key, index, style }) => {
    return (
      <div className="artist-item" key={key} style={style}>
        <img
          src={
            artists[index].picUrl
              ? artists[index].picUrl + '?param=200y200'
              : 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg?param=200y200'
          }
          alt=""
        />
        <p
          className="item-name one-line-ellipsis"
          dangerouslySetInnerHTML={{
            __html: artists[index].name.replace(
              regex,
              x => `<span class="keyword-highlight">${x}</span>`
            )
          }}
        ></p>
      </div>
    )
  }

  return (
    <div className="search-result-artist">
      {hasLoaded === false ? (
        <div className="loading">
          <img src={require('@/assets/svg-icons/loading.svg')} alt="" />
          <span>努力加载中...</span>
        </div>
      ) : (
        <Scroll {...scrollParams}>
          <div className="result-artist">
            {artists && (
              <WindowScroller scrollElement={scrollElement}>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                  <List
                    autoHeight
                    height={height}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    width={window.innerWidth}
                    rowCount={artists.length}
                    rowHeight={window.innerWidth * 0.16}
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

export default React.memo(Artist)
