import React, { useState } from 'react'
import { List, WindowScroller } from 'react-virtualized'
import Scroll from '@/components/scroll'
import { handleNumber, formatTime } from '@/utils/tools'
import './index.scss'

// 搜索结果
const Video = props => {
  const { mvs, fetchMore, loadingStatus, hasLoaded, hasMore, keyword } = props

  const [scrollElement, setScrollElement] = useState()

  const scrollParams = {
    getScrollElement: setScrollElement,
    pullUp: {
      callback() {
        fetchMore('video')
      },
      hasMore,
      loadingStatus
    }
  }

  const regex = new RegExp(keyword, 'gi')

  const rowRenderer = ({ key, index, style }) => {
    return (
      <div className="video-item" key={key} style={style}>
        <div className="video-img">
          <img src={mvs[index].cover + '?param=200y115'} alt="" />
          <div className="play-count">
            <i className="iconfont icon-yousanjiao"></i>
            <span>{handleNumber(mvs[index].playCount)}</span>
          </div>
        </div>
        <div className="item-text">
          <p
            className="item-name"
            dangerouslySetInnerHTML={{
              __html: mvs[index].name.replace(
                regex,
                x => `<span class="keyword-highlight">${x}</span>`
              )
            }}
          ></p>
          <p className="item-info one-line-ellipsis">
            <span>{formatTime(mvs[index].duration / 1000)}</span>
            <span>
              {mvs[index]?.artists?.reduce((total, item, index, arr) => {
                return index !== arr.length - 1 ? total + item.name + '/' : total + item.name
              }, 'by ')}
            </span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="search-result-video">
      {hasLoaded === false ? (
        <div className="loading">
          <img src={require('@/assets/svg-icons/loading.svg')} alt="" />
          <span>努力加载中...</span>
        </div>
      ) : (
        <Scroll {...scrollParams}>
          <div className="result-video">
            {mvs && (
              <WindowScroller scrollElement={scrollElement}>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                  <List
                    autoHeight
                    height={height}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    width={window.innerWidth}
                    rowCount={mvs.length}
                    rowHeight={window.innerWidth * 0.215}
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

export default React.memo(Video)
