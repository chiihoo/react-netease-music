import React from 'react'
import './index.scss'

// 热搜榜
const SearchHotDetail = props => {
  const { searchHotDetail } = props

  return (
    <div className="search-hot-detail">
      <dl>
        <dt>热搜榜</dt>
        {searchHotDetail.map((item, index) => (
          <dd>
            <p className="index">{index + 1}</p>
            <div className="main">
              <p>
                <span className="search-word">{item.searchWord}</span>
                <span className="score">{item.score}</span>
                {item.iconType !== 0 && <i className="iconfont icon-hot"></i>}
                {item.source !== 0 && <i className="iconfont icon-shangjiantou"></i>}
              </p>
              <p>{item.content}</p>
            </div>
          </dd>
        ))}
      </dl>
    </div>
  )
}

export default React.memo(SearchHotDetail)
