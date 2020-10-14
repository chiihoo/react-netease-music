import React, { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useEventListener, useDebouncedCallback } from '@/hooks'
import './index.scss'

const SearchHeader = props => {
  const {
    showKeyword,
    realkeyword,
    searchSuggest,
    getSearchSuggest,
    showSuggest,
    setShowSuggest,
    searchValue,
    setSearchValue,
    goSearch,
    goBack
  } = props

  const [isInputFocus, setIsInputFocus] = useState(true)

  // 回车键进行搜索，如果搜索框没内容，则直接搜索推荐词汇，如果搜索框有内容，则正常搜索
  useEventListener('keydown', e => {
    if (e.keyCode === 13) {
      searchValue === '' ? goSearch(realkeyword) : goSearch(searchValue)
    }
  })

  // 搜索建议防抖
  const debounceHandleKeyUp = useDebouncedCallback(() => {
    if (searchValue !== '') {
      getSearchSuggest(searchValue)
    }
  }, 200)

  // 如果搜索框没内容，将搜索建议关掉
  useEffect(() => {
    if (searchValue === '') {
      setShowSuggest(false)
    }
  }, [searchValue, setShowSuggest])

  return (
    <div className="search-header">
      <div className="header-main">
        <i className="iconfont icon-fanhui" onClick={goBack}></i>
        <div className="search-box">
          <div className="input-wrapper">
            <input
              type="text"
              autoFocus
              placeholder={showKeyword}
              value={searchValue}
              onChange={e => {
                setSearchValue(e.target.value)
                setShowSuggest(true)
              }}
              onFocus={() => setIsInputFocus(true)}
              onBlur={() => setIsInputFocus(false)}
              onKeyUp={debounceHandleKeyUp}
            />
            {searchValue !== '' && (
              <i
                className="iconfont icon-quxiao"
                onClick={() => {
                  setSearchValue('')
                }}
              ></i>
            )}
          </div>
          <div className={classNames('bottom-line', { 'input-focus-line': isInputFocus })}></div>
        </div>
        <i className="iconfont icon-singer"></i>
      </div>
      {showSuggest && (
        <ul className="search-suggest">
          <li onClick={() => goSearch(searchValue)}>
            <p className="main">搜索“{searchValue}”</p>
          </li>
          {searchSuggest?.allMatch?.map(item => (
            <li key={item.keyword} onClick={() => goSearch(item.keyword)}>
              <p className="main">
                <i className="iconfont icon-sousuo"></i>
                <span>{item.keyword}</span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default React.memo(SearchHeader)
