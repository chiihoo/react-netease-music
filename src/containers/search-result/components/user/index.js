import React, { useState } from 'react'
import { List, WindowScroller } from 'react-virtualized'
import Scroll from '@/components/scroll'
import './index.scss'

// 搜索结果-用户
const User = props => {
  const { users, fetchMore, loadingStatus, hasMore, keyword } = props

  const [scrollElement, setScrollElement] = useState()

  const scrollParams = {
    getScrollElement: setScrollElement,
    pullUp: {
      callback() {
        fetchMore('user')
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
            users[index].avatarUrl
              ? users[index].avatarUrl + '?param=200y200'
              : 'http://p1.music.126.net/6y-UleORITEDbvrOLV0Q8A==/5639395138885805.jpg?param=200y200'
          }
          alt=""
        />
        <div className="item-text">
          <p className="item-name one-line-ellipsis">
            <span
              dangerouslySetInnerHTML={{
                __html: users[index].nickname.replace(
                  regex,
                  x => `<span class="keyword-highlight">${x}</span>`
                )
              }}
            ></span>
            {users[index].gender === 1 && <i className="iconfont icon-nan"></i>}
            {users[index].gender === 2 && <i className="iconfont icon-nv"></i>}
          </p>
          {users[index]?.signature && (
            <p className="item-info one-line-ellipsis">{users[index]?.signature}</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="search-result-artist">
      <Scroll {...scrollParams}>
        <div className="result-artist">
          {users && (
            <WindowScroller scrollElement={scrollElement}>
              {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <List
                  autoHeight
                  height={height}
                  isScrolling={isScrolling}
                  onScroll={onChildScroll}
                  scrollTop={scrollTop}
                  width={window.innerWidth}
                  rowCount={users.length}
                  rowHeight={window.innerWidth * 0.16}
                  rowRenderer={rowRenderer}
                />
              )}
            </WindowScroller>
          )}
        </div>
      </Scroll>
    </div>
  )
}

export default React.memo(User)
