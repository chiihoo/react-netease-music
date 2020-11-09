import React, { useState } from 'react'
import { List, WindowScroller } from 'react-virtualized'
import Scroll from '@/components/scroll'
import './index.scss'

// 搜索结果-主播电台
const DjRadio = props => {
  const { djRadios, fetchMore, loadingStatus, hasMore, keyword } = props

  const [scrollElement, setScrollElement] = useState()

  const scrollParams = {
    getScrollElement: setScrollElement,
    pullUp: {
      callback() {
        fetchMore('djRadio')
      },
      hasMore,
      loadingStatus
    }
  }

  const regex = new RegExp(keyword, 'gi')

  const rowRenderer = ({ key, index, style }) => {
    return (
      <div className="dj-radio-item" key={key} style={style}>
        <img src={djRadios[index]?.picUrl + '?param=200y200'} alt="" />
        <div className="item-text">
          <p
            className="item-name one-line-ellipsis"
            dangerouslySetInnerHTML={{
              __html: djRadios[index]?.name.replace(
                regex,
                x => `<span class="keyword-highlight">${x}</span>`
              )
            }}
          ></p>
          <p className="item-info one-line-ellipsis">
            <span>{djRadios[index]?.dj?.nickname}</span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="search-result-dj-radio">
      <Scroll {...scrollParams}>
        {djRadios && (
          <>
            <h4 className="header-title">电台</h4>
            <WindowScroller scrollElement={scrollElement}>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  width={window.innerWidth}
                  rowCount={djRadios?.length}
                  rowHeight={window.innerWidth * 0.185}
                  rowRenderer={rowRenderer}
                />
              )}
            </WindowScroller>
          </>
        )}
      </Scroll>
    </div>
  )
}

export default React.memo(DjRadio)
