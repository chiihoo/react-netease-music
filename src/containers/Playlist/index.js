import React, { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useObserver } from 'mobx-react-lite'
import { isEmpty } from 'lodash-es'
import { useStores } from '@/stores'
import Scroll from '@/components/Scroll'
import PlaylistHeader from './components/PlaylistHeader'
import PlaylistInfo from './components/PlaylistInfo'
import PlaylistDetail from './components/PlaylistDetail'

import './index.scss'

const Playlist = () => {
  // 获取scroll的那个dom元素，传给react-virtualized的WindowScroller组件
  const [scrollElement, setScrollElement] = useState()
  // 下拉headerHeight距离后，header文字有"歌单"变为滚动歌单名
  const [isTicker, setIsTicker] = useState(false)
  // 下拉targetHeight距离后，opacity由1线性变为0
  const [opactiy, setOpactiy] = useState(1)

  const params = useParams()
  const { PlaylistStore } = useStores()

  useEffect(() => {
    PlaylistStore.getPlaylistData(params.id)
  }, [PlaylistStore, params.id])

  const headerHeight = useMemo(() => window.innerWidth * 0.14667, [])
  const targetHeight = useMemo(() => window.innerWidth * 0.516, [])

  const scrollProps = {
    getScrollElement: setScrollElement,
    onScrollFn: e => {
      setIsTicker(e.target.scrollTop >= headerHeight)
      if (e.target.scrollTop >= targetHeight) {
        setOpactiy(0)
      } else {
        setOpactiy(1 - e.target.scrollTop / targetHeight)
      }
    }
  }

  return useObserver(() => (
    <div className="playlist">
      <div className="scroll-wrapper">
        <Scroll {...scrollProps}>
          <PlaylistHeader playlistData={PlaylistStore.playlistData} isTicker={isTicker} />
          {!isEmpty(PlaylistStore.playlistData) && (
            <PlaylistInfo playlistData={PlaylistStore.playlistData} opactiy={opactiy} />
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
