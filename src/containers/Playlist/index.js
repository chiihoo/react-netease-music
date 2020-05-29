import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useObserver } from 'mobx-react-lite'
import { isEmpty } from 'lodash-es'
import { useStores } from '@/stores'
import { imgBlurToBase64 } from '@/utils/tools'
import Scroll from '@/components/Scroll'
import PlaylistHeader from './components/PlaylistHeader'
import PlaylistSongSearchResult from './components/PlaylistSongSearchResult'
import PlaylistInfo from './components/PlaylistInfo'
import PlaylistDetail from './components/PlaylistDetail'
import './index.scss'

const HEADER_HEIGHT = window.innerWidth * 0.14667
const TARGET_HEIGHT = window.innerWidth * 0.529

const Playlist = () => {
  // 获取scroll的那个dom元素，传给react-virtualized的WindowScroller组件
  const [scrollElement, setScrollElement] = useState()
  // 下拉HEADER_HEIGHT距离后，header文字有"歌单"变为滚动歌单名
  const [isTicker, setIsTicker] = useState(false)
  // 下拉TARGET_HEIGHT距离后，opacity由1线性变为0
  const [opacity, setOpacity] = useState(1)
  // 高斯模糊后的背景图片
  const [coverImgUrl, setCoverImgUrl] = useState()
  // 是否点击了头部的搜索按钮
  const [isSearch, setIsSearch] = useState(false)
  // 搜索框输入的文字
  const [searchValue, setSearchValue] = useState('')
  // 防抖操作，连续输入后，一段时间不输入，置为true，再还原false
  const [startSearch, setStartSearch] = useState(false)

  const params = useParams()
  const { PlaylistStore } = useStores()

  useEffect(() => {
    PlaylistStore.getPlaylistData(params.id)
  }, [PlaylistStore, params.id])

  // 给背景图片高斯模糊
  useEffect(() => {
    ;(async function () {
      // 先把图片缩略，再进行高斯模糊
      if (PlaylistStore.playlistData.coverImgUrl) {
        const imgUrl = await imgBlurToBase64(
          PlaylistStore.playlistData.coverImgUrl + '?imageView=1&thumbnail=225x0',
          50
        )
        setCoverImgUrl(imgUrl)
      }
    })()
  }, [PlaylistStore.playlistData.coverImgUrl])

  const scrollProps = {
    getScrollElement: setScrollElement,
    onScrollFn: e => {
      setIsTicker(e.target.scrollTop >= HEADER_HEIGHT)
      if (e.target.scrollTop >= TARGET_HEIGHT) {
        setOpacity(0)
      } else {
        setOpacity(1 - e.target.scrollTop / TARGET_HEIGHT)
      }
    }
  }

  return useObserver(() => (
    <div className="playlist">
      <div className="scroll-wrapper">
        <Scroll {...scrollProps}>
          <PlaylistHeader
            playlistData={PlaylistStore.playlistData}
            isTicker={isTicker}
            coverImgUrl={coverImgUrl}
            opacity={1 - opacity}
            scrollElement={scrollElement}
            isSearch={isSearch}
            setIsSearch={setIsSearch}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
            setStartSearch={setStartSearch}
          />
          {isSearch && (
            <PlaylistSongSearchResult
              songsData={PlaylistStore.songsData}
              searchValue={searchValue}
              startSearch={startSearch}
            />
          )}
          {!isEmpty(PlaylistStore.playlistData) && (
            <PlaylistInfo
              playlistData={PlaylistStore.playlistData}
              coverImgUrl={coverImgUrl}
              opacity={opacity}
            />
          )}
          <PlaylistDetail
            playlistData={PlaylistStore.playlistData}
            songsData={PlaylistStore.songsData}
            scrollElement={scrollElement}
          />
        </Scroll>
      </div>
    </div>
  ))
}

export default React.memo(Playlist)
