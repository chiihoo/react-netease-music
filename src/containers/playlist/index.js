import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { useObserver } from 'mobx-react-lite'
import { isEmpty } from 'lodash-es'
import { useStores } from '@/stores'
import { imgBlurToBase64 } from '@/utils/tools'
import Scroll from '@/components/scroll'
import PlaylistHeader from './components/playlist-header'
import PlaylistSearchResult from './components/playlist-search-result'
import PlaylistInfo from './components/playlist-info'
import PlaylistDetail from './components/playlist-detail'
import PlaylistSkeleton from '@/skeletons/playlist-skeleton'
import toast from '@/components/toast'
import './index.scss'

// 播放全部的这个dom元素与header底部的距离，大概是198.375px
const TARGET_HEIGHT = window.innerWidth * 0.529

// 歌单详情页面
const Playlist = () => {
  // 获取scroll的那个dom元素，传给react-virtualized的WindowScroller组件
  const [scrollElement, setScrollElement] = useState()
  // 下拉HEADER_HEIGHT距离后，header文字有"歌单"变为滚动歌单名
  const [isTicker, setIsTicker] = useState(false)
  // 下拉TARGET_HEIGHT距离后，opacity由1线性变为0
  const [opacity, setOpacity] = useState(1)
  // 高斯模糊后的背景图片
  const [blurCoverImgUrl, setBlurCoverImgUrl] = useState()
  // 是否点击了头部的搜索按钮
  const [isSearch, setIsSearch] = useState(false)
  // 搜索框输入的文字
  const [searchValue, setSearchValue] = useState('')
  // 防抖操作，连续输入后，一段时间不输入，置为true，再还原false
  const [startSearch, setStartSearch] = useState(false)

  const headerRef = useRef()

  const params = useParams()
  const history = useHistory()

  const { playlistStore, playerStore, loginStore } = useStores()

  useEffect(() => {
    playlistStore.getPlaylistData(params.id)
    // eslint-disable-next-line
  }, [])

  // 给背景图片高斯模糊
  useEffect(() => {
    ;(async function () {
      // 先把图片缩略，再进行高斯模糊
      if (playlistStore.playlistData.coverImgUrl) {
        const imgUrl = await imgBlurToBase64(
          playlistStore.playlistData.coverImgUrl + '?param=200y200',
          50
        )
        setBlurCoverImgUrl(imgUrl)
      }
    })()
  }, [playlistStore.playlistData.coverImgUrl])

  const scrollProps = {
    getScrollElement: setScrollElement,
    onScrollFn: e => {
      setIsTicker(e.target.scrollTop >= headerRef.current.offsetHeight)
      if (e.target.scrollTop >= TARGET_HEIGHT) {
        setOpacity(0)
      } else {
        setOpacity(1 - e.target.scrollTop / TARGET_HEIGHT)
      }
    }
  }

  // 点击单行歌曲项，进行播放
  const handleSongItemClick = useCallback(async (songId, isVIPSong) => {
    await playerStore.addSongToPlay(songId, playlistStore.songs, playlistStore.privileges)
    // eslint-disable-next-line
  }, [])

  // 点击播放全部
  const handlePlayAllClick = useCallback(() => {
    playerStore.playAll(playlistStore.songs, playlistStore.privileges)
    // eslint-disable-next-line
  }, [])

  // 点击标题，回到顶部
  const goTop = useCallback(() => {
    scrollElement.scrollTo(0, 0)
  }, [scrollElement])

  // 收藏歌单
  const handleSubscribePlaylist = useCallback(() => {
    if (loginStore.isLogin) {
      playlistStore
        .subscribePlaylist(params?.id)
        .then(() => {
          toast.info('收藏成功')
        })
        .catch(err => {
          toast.info('接口出错')
        })
    } else {
      history.push('/login')
    }
    // eslint-disable-next-line
  }, [history, loginStore.isLogin, params?.id])

  // 取消收藏歌单
  const handleUnsubscribePlaylist = useCallback(() => {
    if (loginStore.isLogin) {
      playlistStore
        .unsubscribePlaylist(params?.id)
        .then(() => {
          toast.info('取消收藏')
        })
        .catch(err => {
          toast.info('接口出错')
        })
    } else {
      history.push('/login')
    }
    // eslint-disable-next-line
  }, [history, loginStore.isLogin, params?.id])

  return useObserver(() => (
    <div className="playlist">
      {playlistStore.loadingStatus === 0 ? (
        <PlaylistSkeleton />
      ) : (
        <>
          <PlaylistHeader
            playlistName={playlistStore.playlistData.name}
            playlistId={playlistStore.playlistData.id}
            isTicker={isTicker}
            blurCoverImgUrl={blurCoverImgUrl}
            opacity={1 - opacity}
            goTop={goTop}
            isSearch={isSearch}
            setIsSearch={setIsSearch}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setStartSearch={setStartSearch}
            ref={headerRef}
          />
          <div className="scroll-wrapper">
            <Scroll {...scrollProps}>
              {isSearch && (
                <PlaylistSearchResult
                  songs={playlistStore.songs}
                  privileges={playlistStore.privileges}
                  currentSongId={playerStore.currentSongId}
                  searchValue={searchValue}
                  startSearch={startSearch}
                  handleSongItemClick={handleSongItemClick}
                />
              )}
              {!isEmpty(playlistStore.playlistData) && (
                <PlaylistInfo
                  playCount={playlistStore.playlistData.playCount}
                  coverImgUrl={playlistStore.playlistData.coverImgUrl}
                  playlistName={playlistStore.playlistData.name}
                  description={playlistStore.playlistData.description}
                  commentCount={playlistStore.playlistData.commentCount}
                  shareCount={playlistStore.playlistData.shareCount}
                  avatarUrl={playlistStore.playlistData.creator.avatarUrl}
                  nickname={playlistStore.playlistData.creator.nickname}
                  blurCoverImgUrl={blurCoverImgUrl}
                  opacity={opacity}
                />
              )}
              <PlaylistDetail
                trackCount={playlistStore.playlistData.trackCount}
                subscribers={playlistStore.playlistData.subscribers}
                subscribedCount={playlistStore.playlistData.subscribedCount}
                subscribed={playlistStore.subscribed}
                songs={playlistStore.songs}
                privileges={playlistStore.privileges}
                currentSongId={playerStore.currentSongId}
                scrollElement={scrollElement}
                handleSongItemClick={handleSongItemClick}
                handlePlayAllClick={handlePlayAllClick}
                handleSubscribePlaylist={handleSubscribePlaylist}
                handleUnsubscribePlaylist={handleUnsubscribePlaylist}
              />
            </Scroll>
          </div>
        </>
      )}
    </div>
  ))
}

export default React.memo(Playlist)
