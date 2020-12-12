import React, { useState, useEffect, useRef } from 'react'
import { useHistory } from 'react-router-dom'
import { List, WindowScroller, AutoSizer } from 'react-virtualized'
import classNames from 'classnames'
import Scroll from '@/components/scroll'
import { useStores } from '@/stores'
import { useObserver } from 'mobx-react-lite'
import './index.scss'

const My = props => {
  const history = useHistory()

  const { loginStore } = useStores()

  const [scrollElement, setScrollElement] = useState()

  // 创建歌单和收藏歌单选项是否sticky了
  const [isSticky, setIsSticky] = useState(false)
  // 当前滑动到我创建的歌单还是我收藏的歌单了
  const [activeItem, setActiveItem] = useState('myCreatedPlaylist') // myCreatedPlaylist、myCollectedPlaylist
  // 创建歌单和收藏歌单选项
  const playlistOptionsRef = useRef()
  // 我创建的歌单
  const myCreatedPlaylistRef = useRef()
  // 我收藏的歌单
  const myCollectedPlaylistRef = useRef()

  useEffect(() => {
    if (loginStore.userId) {
      loginStore.getUserPlaylist(loginStore.userId)
    }
    // eslint-disable-next-line
  }, [loginStore.userId])

  // 我创建的歌单是不需要写'by chiihooy'的，而我收藏的歌单需要写'by 创建者'
  function rowRendererGenerator(data, needBy = true) {
    return ({ key, index, style }) => {
      return (
        <div className="my-playlist-item" key={key} style={style}>
          <div className="left" onClick={() => history.push(`/playlist/${data[index].id}`)}>
            <img src={data[index].coverImgUrl + '?params=200y200'} alt="" />
            <div className="left-mid">
              <p className="one-line-ellipsis">{data[index].name}</p>
              <p className="one-line-ellipsis">
                {data[index].trackCount}首
                {needBy && <span>, by {data[index]?.creator.nickname}</span>}
              </p>
            </div>
          </div>
          <i className="iconfont icon-more"></i>
        </div>
      )
    }
  }

  const rowRenderer_created = rowRendererGenerator(loginStore.myCreatedPlaylist, false)
  const rowRenderer_collected = rowRendererGenerator(loginStore.myCollectedPlaylist)

  const scrollProps = {
    getScrollElement: setScrollElement,
    onScrollFn: e => {
      setIsSticky(e.target.scrollTop >= playlistOptionsRef.current.offsetTop)
      // offsetTop是相对于最近定位父元素计算的，此处即为scroll的那个dom元素
      setActiveItem(
        e.target.scrollTop >=
          myCollectedPlaylistRef.current.offsetTop - playlistOptionsRef.current.offsetHeight
          ? 'myCollectedPlaylist'
          : 'myCreatedPlaylist'
      )
    }
  }

  const scrollToMyCreatedPlaylist = () => {
    scrollElement.scrollTo({ top: myCreatedPlaylistRef.current.offsetTop, behavior: 'smooth' })
  }
  const scrollToMyCollectedPlaylist = () => {
    scrollElement.scrollTo({
      top: myCollectedPlaylistRef.current.offsetTop - playlistOptionsRef.current.offsetHeight,
      behavior: 'smooth'
    })
  }

  return useObserver(() => (
    <div className="my">
      <Scroll {...scrollProps}>
        <div
          className="my-header"
          onClick={() => {
            // 应该是未登录状态点击才是跳转登录
            if (!loginStore.isLogin) {
              history.push('/login')
            }
          }}
        >
          <div className="avatar-warpper">
            {loginStore.accountInfo.profile?.avatarUrl ? (
              <div
                className="avatar"
                style={{
                  background:
                    loginStore.accountInfo.profile?.avatarUrl &&
                    `url(${loginStore.accountInfo.profile?.avatarUrl}?param=200y200) center/cover no-repeat`
                }}
              ></div>
            ) : (
              <i className="iconfont icon-touxiang"></i>
            )}
          </div>
          <span>{loginStore.accountInfo.profile?.nickname || '立即登录'}</span>
          <i className="iconfont icon-gengduo"></i>
        </div>
        <div
          className="like-music"
          onClick={() => {
            if (loginStore.myFavoritePlaylist?.id) {
              history.push(`/playlist/${loginStore.myFavoritePlaylist?.id}`)
            }
          }}
        >
          <div className="left">
            {loginStore.myFavoritePlaylist?.coverImgUrl ? (
              <div
                className="left-cover-img"
                style={{
                  background: `url(${loginStore.myFavoritePlaylist?.coverImgUrl}?param=200y200) center/cover no-repeat`
                }}
              ></div>
            ) : (
              <i className="iconfont icon-xihuan"></i>
            )}
          </div>
          <div className="right">
            <p className="one-line-ellipsis">我喜欢的音乐</p>
            <p className="one-line-ellipsis">{loginStore.myFavoritePlaylist?.trackCount || 0}首</p>
          </div>
        </div>
        <ul
          className={classNames('playlist-options', { sticky: isSticky })}
          ref={playlistOptionsRef}
        >
          <li
            className={classNames({ avtive: activeItem === 'myCreatedPlaylist' })}
            onClick={scrollToMyCreatedPlaylist}
          >
            创建歌单
          </li>
          <li
            className={classNames({ avtive: activeItem === 'myCollectedPlaylist' })}
            onClick={scrollToMyCollectedPlaylist}
          >
            收藏歌单
          </li>
        </ul>
        <div className="playlist-area">
          <div className="playlist-create" ref={myCreatedPlaylistRef}>
            <div className="header">
              <span>创建歌单({loginStore.myCreatedPlaylist.length}个)</span>
              <div>
                <i className="iconfont icon-jiahao"></i>
                <i className="iconfont icon-more"></i>
              </div>
            </div>
            {loginStore.myCreatedPlaylist.length > 0 && (
              <WindowScroller scrollElement={scrollElement}>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <List
                        autoHeight
                        height={height}
                        isScrolling={isScrolling}
                        onScroll={onChildScroll}
                        scrollTop={scrollTop}
                        width={width}
                        rowCount={loginStore.myCreatedPlaylist.length}
                        rowHeight={window.innerWidth * 0.185}
                        rowRenderer={rowRenderer_created}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            )}
            <div className="bottom">
              <div className="left">
                <i className="iconfont icon-daoru"></i>
              </div>
              <span>导入外部歌单</span>
            </div>
          </div>
          <div className="playlist-collect" ref={myCollectedPlaylistRef}>
            <div className="header">
              <span>收藏歌单({loginStore.myCollectedPlaylist.length}个)</span>
              <i className="iconfont icon-more"></i>
            </div>
            {loginStore.myCollectedPlaylist.length > 0 ? (
              <WindowScroller scrollElement={scrollElement}>
                {({ height, isScrolling, onChildScroll, scrollTop }) => (
                  <AutoSizer disableHeight>
                    {({ width }) => (
                      <List
                        autoHeight
                        height={height}
                        isScrolling={isScrolling}
                        onScroll={onChildScroll}
                        scrollTop={scrollTop}
                        width={width}
                        rowCount={loginStore.myCollectedPlaylist.length}
                        rowHeight={window.innerWidth * 0.185}
                        rowRenderer={rowRenderer_collected}
                      />
                    )}
                  </AutoSizer>
                )}
              </WindowScroller>
            ) : (
              <div className="bottom">
                <span className="no-collect">暂无收藏的歌单</span>
              </div>
            )}
          </div>
        </div>
      </Scroll>
    </div>
  ))
}

export default React.memo(My)
