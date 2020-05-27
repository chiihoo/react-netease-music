import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useObserver } from 'mobx-react-lite'
import { isEmpty } from 'lodash-es'
import { useStores } from '@/stores'
import { imgBlurToBase64 } from '@/utils/tools'
import Scroll from '@/components/Scroll'
import PlaylistHeader from './components/PlaylistHeader'
import PlaylistInfo from './components/PlaylistInfo'
import PlaylistDetail from './components/PlaylistDetail'
import './index.scss'

const HEADER_HEIGHT = window.innerWidth * 0.14667
const TARGET_HEIGHT = window.innerWidth * 0.516

const Playlist = () => {
  // 获取scroll的那个dom元素，传给react-virtualized的WindowScroller组件
  const [scrollElement, setScrollElement] = useState()
  // 下拉HEADER_HEIGHT距离后，header文字有"歌单"变为滚动歌单名
  const [isTicker, setIsTicker] = useState(false)
  // 下拉TARGET_HEIGHT距离后，opacity由1线性变为0
  const [opacity, setOpacity] = useState(1)
  // 高斯模糊后的背景图片
  const [coverImgUrl, setCoverImgUrl] = useState()

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
          />
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
