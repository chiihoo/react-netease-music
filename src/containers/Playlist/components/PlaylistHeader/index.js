import React, { useCallback, useRef } from 'react'
import { debounce } from 'lodash-es'
import { useHistory } from 'react-router-dom'
import Ticker from '@/components/Ticker'

import './index.scss'

// 歌单页面顶部header
const PlaylistHeader = props => {
  const {
    playlistData,
    isTicker,
    coverImgUrl,
    opacity,
    scrollElement,
    isSearch,
    setIsSearch,
    searchValue,
    setSearchValue,
    setStartSearch
  } = props

  const history = useHistory()

  const inputRef = useRef()

  // 点击返回箭头
  const goBack = useCallback(() => {
    isSearch ? setIsSearch(false) : history.goBack()
  }, [isSearch, setIsSearch, history])

  // 点击标题，回到顶部
  const goTop = useCallback(() => {
    scrollElement.scrollTo(0, 0)
  }, [scrollElement])

  // 点击搜索，弹出搜索框
  const goSearch = useCallback(() => {
    setIsSearch(true)
  }, [setIsSearch])

  // 绑定input
  const handleInputChange = useCallback(
    e => {
      setSearchValue(e.target.value)
    },
    [setSearchValue]
  )

  // 搜索框按下按键
  const handleKeyDown = useCallback(() => {
    setStartSearch(false)
  }, [setStartSearch])

  // 搜索框输入防抖，松开按键
  const debounceHandleKeyUp = useCallback(
    debounce(() => {
      setStartSearch(true)
    }, 200),
    []
  )

  // 清空输入框，也需要触发startSearch，以保证搜索结果组件searchFinished状态正常刷新
  const cancleInput = useCallback(() => {
    setSearchValue('')
    setStartSearch(false)
    inputRef.current.focus()
  }, [setSearchValue, setStartSearch])

  return (
    <div className="playlist-header">
      <div
        className="playlist-header-bg-img"
        style={{
          backgroundImage: `url(${coverImgUrl})`,
          opacity,
          height: opacity === 1 && '18.667vw'
        }}
      ></div>
      <i className="iconfont icon-fanhui" onClick={goBack}></i>
      {!isSearch ? (
        <>
          <div className="title" onClick={goTop}>
            {!isTicker ? (
              <span>歌单</span>
            ) : (
              <Ticker speed={window.innerWidth / 150} childMargin={window.innerWidth / 7.5}>
                <span style={{ whiteSpace: 'nowrap' }}>{playlistData.name}</span>
              </Ticker>
            )}
          </div>
          <i className="iconfont icon-sousuo" onClick={goSearch}></i>
          <i className="iconfont icon-more"></i>
        </>
      ) : (
        <div className="search-box">
          <div className="search-box-main">
            <input
              type="text"
              className="search-box-input"
              value={searchValue}
              onChange={handleInputChange}
              placeholder="搜索歌单内歌曲"
              autoFocus
              spellCheck={false}
              onKeyDown={handleKeyDown}
              onKeyUp={debounceHandleKeyUp}
              ref={inputRef}
            />
            {searchValue !== '' && <i className="iconfont icon-quxiao" onClick={cancleInput}></i>}
          </div>
          <div className="bottom-line"></div>
        </div>
      )}
    </div>
  )
}

export default React.memo(PlaylistHeader)
