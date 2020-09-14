import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import classNames from 'classnames'
import { useEventListener, useDebouncedCallback } from '@/hooks'
import './index.scss'

const SearchHeader = props => {
  const { showKeyword, realKeyword, searchSuggest, getSearchResult, getSearchSuggest } = props

  const history = useHistory()

  const [searchValue, setSearchValue] = useState('')
  const [isInputFocus, setIsInputFocus] = useState(true)

  useEventListener('keydown', e => {
    if (e.keyCode === 13) {
      searchValue === '' ? getSearchResult(realKeyword) : getSearchResult(searchValue)
    }
  })

  const debounceHandleKeyUp = useDebouncedCallback(() => {
    if (searchValue !== '') {
      getSearchSuggest(searchValue)
    }
  }, 200)

  return (
    <div className="search-header">
      <div className="header-main">
        <i className="iconfont icon-fanhui" onClick={history.goBack}></i>
        <div className="search-box">
          <div className="input-wrapper">
            <input
              type="text"
              autoFocus
              placeholder={showKeyword}
              value={searchValue}
              onChange={e => setSearchValue(e.target.value)}
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
      {searchValue !== '' && (
        <ul className="search-suggest">
          <li>
            <p className="main">搜索“{searchValue}”</p>
          </li>
          {searchSuggest?.allMatch?.map(item => (
            <li key={item.keyword}>
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
