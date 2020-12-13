import React, { useEffect, useMemo, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import { chunk } from 'lodash-es'
import { useStores } from '@/stores'
import Carousel from '@/components/carousel'
import Scroll from '@/components/scroll'
import PlaylistRecommend from './components/playlist-recommend'
import NewSongsAlbumsRecommend from './components/new-songs-albums-recommend'
import { hasNotDoneToast } from '@/utils/tools'
import './index.scss'

// 首页发现页面
const Find = observer(function Find() {
  const { findStore, playerStore } = useStores()

  useEffect(() => {
    findStore.getFindData()
    // eslint-disable-next-line
  }, [])

  const scrollParams = {
    loadingStatus: findStore.loadingStatus,
    pullDown: {
      callback() {
        findStore.getFindData()
      },
      loadingStatus: findStore.loadingStatus
    },
    // 越宽的屏幕，下拉刷新的距离就要越大
    refreshThreshold: window.innerWidth * 0.187, // 下拉达到刷新的距离界限 70 (以375px屏幕为例)
    touchThreshold: window.innerWidth * 0.352, // 滑块最多滑动到的距离 132
    loadingStop: window.innerWidth * 0.187, // 下拉刷新 loading时，滑块停留的位置 70
    tipsStop: window.innerWidth * 0.133, // tips停留的位置 50
    ratio: 1000 / window.innerWidth //系数是要乘以下拉的距离，来得到旋转的角度
  }

  // 点击单行歌曲项，进行播放
  const handleSongItemClick = useCallback(
    songId => {
      playerStore.addSongToPlay(songId, findStore.newSongs, findStore.privileges)
    },
    // eslint-disable-next-line
    [findStore.newSongs]
  )

  const newSongs = useMemo(() => chunk(findStore.newSongs.slice(0, 6), 3), [findStore.newSongs])
  const newAlbums = useMemo(() => chunk(findStore.newAlbums.slice(0, 6), 3), [findStore.newAlbums])

  return (
    <div className="find">
      <Scroll {...scrollParams}>
        <div className="find-carousel">
          <Carousel bannerList={findStore.bannerList}></Carousel>
        </div>
        <div className="find-nav">
          <div onClick={hasNotDoneToast}>
            <i className="iconfont icon-rili"></i>
            <span>每日推荐</span>
          </div>
          <div onClick={hasNotDoneToast}>
            <i className="iconfont icon-gedan"></i>
            <span>歌单</span>
          </div>
          <div onClick={hasNotDoneToast}>
            <i className="iconfont icon-paihangbang"></i>
            <span>排行榜</span>
          </div>
          <div onClick={hasNotDoneToast}>
            <i className="iconfont icon-diantai"></i>
            <span>电台</span>
          </div>
        </div>
        <div className="recommend-nav">
          <div className="playlist-recommend-wrapper">
            <PlaylistRecommend
              playlists={findStore.recommendPlaylists}
              title={'歌单推荐'}
              intro={'为你精挑细选'}
            />
          </div>
          <div className="scene-recommend-wrapper">
            <PlaylistRecommend
              playlists={findStore.sceneRecommendPlaylists}
              title={'场景推荐'}
              intro={'音乐 照亮你心坎'}
            />
          </div>
          <div className="new-songs-albums-recommend-wrapper">
            <NewSongsAlbumsRecommend
              newSongs={newSongs}
              newAlbums={newAlbums}
              currentSongId={playerStore.currentSongId}
              handleSongItemClick={handleSongItemClick}
            />
          </div>
        </div>
      </Scroll>
    </div>
  )
})

export default React.memo(Find)
