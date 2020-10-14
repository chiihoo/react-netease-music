import React from 'react'
import './index.scss'

// 热搜榜
const SearchContent = props => {
  const { searchHotDetail, deleteAllSearchHistory, searchHistory, goSearch } = props

  return (
    <div className="search-content">
      {searchHistory.length > 0 && (
        <div className="search-history">
          <h4>历史</h4>
          <ul className="history-detail">
            {searchHistory.map(item => (
              <li key={item} onClick={() => goSearch(item)}>
                {item}
              </li>
            ))}
          </ul>
          <i className="iconfont icon-delete2" onClick={() => deleteAllSearchHistory()}></i>
        </div>
      )}
      <div className="search-hot-detail">
        <dl>
          <dt>热搜榜</dt>
          {searchHotDetail.map((item, index) => (
            <dd
              key={item.searchWord}
              onClick={() => {
                goSearch(item.searchWord)
              }}
            >
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
    </div>
  )
}

export default React.memo(SearchContent)
