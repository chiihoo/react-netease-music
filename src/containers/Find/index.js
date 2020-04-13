import React, { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { createSelector } from 'reselect'
import { actions } from './store'
import { chunk } from 'lodash'
import Slider from '@/components/Slider'
import HotwallNav from './components/HotwallNav'
import PlaylistRecommend from './components/PlaylistRecommend'
import SongAlbumRecommend from './components/SongAlbumRecommend'
import './index.scss'

// 首页发现页面
const Find = () => {
  const dispatch = useDispatch()

  // Find是最上层store里面定义的 Find: FindReducer

  // reselect可以用来避免冗余计算，reselect会把最后一个参数计算得出的值缓存起来，如下所示，
  // 如果state.Find.hotwallList的值经过浅比较没有变化，就会取缓存值，如果有变化，则会重新计算，返回结果并缓存。
  // 因为是不可变数据，所以只要更改了，浅比较就肯定不相等。

  const selectHotwallNavList = useMemo(
    () =>
      createSelector(
        state => state.Find.hotwallList,
        items =>
          items.map(item => ({
            id: item.id,
            content: item.content,
            avatar: item.simpleUserInfo.avatar,
            songCoverUrl: item.simpleResourceInfo.songCoverUrl
          }))
      ),
    []
  )
  const selectNewSongAlbum = useMemo(
    () =>
      createSelector(
        state => state.Find.newSongs,
        state => state.Find.newAlbums,
        (newSongs, newAlbums) => ({
          newSongs: chunk(newSongs.slice(0, 6), 3),
          newAlbums: chunk(newAlbums.slice(0, 6), 3)
        })
      ),
    []
  )
  const bannerList = useSelector(state => state.Find.bannerList)
  const hotwallNavList = useSelector(selectHotwallNavList)
  const recommendPlaylists = useSelector(state => state.Find.recommendPlaylists)
  const sceneRecommendPlaylists = useSelector(state => state.Find.sceneRecommendPlaylists)
  const newSongAlbum = useSelector(selectNewSongAlbum)

  useEffect(() => {
    dispatch(actions.fetchBannerList())
    dispatch(actions.fetchHotwallList())
    dispatch(actions.fetchRecommendPlaylists())
    dispatch(actions.fetchSceneRecommendPlaylists())
    dispatch(actions.fetchNewSongs())
    dispatch(actions.fetchNewAlbums())
  }, [dispatch])

  return (
    <div className="Find">
      {bannerList.length > 0 && <Slider bannerList={bannerList}></Slider>}
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
      <div className="hotwall-nav">
        {hotwallNavList.length > 0 && <HotwallNav hotwallNavList={hotwallNavList} />}
      </div>
      <div className="recommend-nav">
        <div className="playlist-recommend">
          <PlaylistRecommend
            playlists={recommendPlaylists}
            title={'歌单推荐'}
            intro={'为你精挑细选'}
            linkTo={'/playlist/recommend'}
          />
        </div>
        <div className="scene-recommend">
          <PlaylistRecommend
            playlists={sceneRecommendPlaylists}
            title={'场景推荐'}
            intro={'音乐 照亮你心坎'}
            linkTo={'/playlist/recommend/official'}
          />
        </div>
        <div className="new-song-album-recommend">
          <SongAlbumRecommend newSongAlbum={newSongAlbum} />
        </div>
      </div>
    </div>
  )
}

export default React.memo(Find)
