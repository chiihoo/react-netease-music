import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '@/stores'
import Slider from '@/components/Slider'
import Scroll from '@/components/Scroll'
import HotwallNav from './components/HotwallNav'
import PlaylistRecommend from './components/PlaylistRecommend'
import SongAlbumRecommend from './components/SongAlbumRecommend'
import './index.scss'

// 首页发现页面
const Find = () => {
  const { FindStore } = useStores()

  useEffect(() => {
    FindStore.getFindData()
  }, [FindStore])

  // 需要用useObserver来监听FindStore.loadingStatus
  // 实际上可以把useObserver替换成 const Find = observer(function Find() {})
  // 但是使用observer，无法在react开发者工具中看到这个组件的状态
  const scrollParams = useObserver(() => ({
    loadingStatus: FindStore.loadingStatus,
    pullDown: {
      callback() {
        FindStore.getFindData()
      },
      loadingStatus: FindStore.loadingStatus
    }
  }))

  return useObserver(() => (
    <div className="find">
      <Scroll {...scrollParams}>
        <div className="find-slider">
          <Slider bannerList={FindStore.bannerList}></Slider>
        </div>
        <div className="find-nav">
          <Link to="/recommend/taste">
            <i className="iconfont icon-rili"></i>
            <span>每日推荐</span>
          </Link>
          <Link to="/playlist">
            <i className="iconfont icon-gedan"></i>
            <span>歌单</span>
          </Link>
          <Link to="/toplist">
            <i className="iconfont icon-paihangbang"></i>
            <span>排行榜</span>
          </Link>
          <Link to="/radio">
            <i className="iconfont icon-diantai"></i>
            <span>电台</span>
          </Link>
        </div>
        <div className="hotwall-nav-wrapper">
          {FindStore.hotwallNavList.length > 0 && (
            <HotwallNav hotwallNavList={FindStore.hotwallNavList} />
          )}
        </div>
        <div className="recommend-nav">
          <div className="playlist-recommend-wrapper">
            <PlaylistRecommend
              playlists={FindStore.recommendPlaylists}
              title={'歌单推荐'}
              intro={'为你精挑细选'}
              linkTo={'/playlist/recommend'}
            />
          </div>
          <div className="scene-recommend-wrapper">
            <PlaylistRecommend
              playlists={FindStore.sceneRecommendPlaylists}
              title={'场景推荐'}
              intro={'音乐 照亮你心坎'}
              linkTo={'/playlist/recommend/official'}
            />
          </div>
          <div className="new-song-album-recommend-wrapper">
            <SongAlbumRecommend newSongAlbum={FindStore.newSongAlbum} />
          </div>
        </div>
      </Scroll>
    </div>
  ))
}

export default React.memo(Find)
