import React, { useState, useEffect } from 'react'
import SongItem from '../song-item'
import loadingSvg from '@/assets/svg-icons/loading.svg'
import './index.scss'

// 由于"播放全部"这行需要将header背景图片的下端盖住，以保证填充圆弧部分，
// 故header的z-index要比"播放全部"低
// 所以这个搜索结果不能放在PlaylistHeader组件中，否则无法将"播放全部"盖在底下

// PlaylistHeader搜索的结果
const PlaylistSearchResult = props => {
  // startSearch为输入框防抖操作，一段时间不操作为true，一直输入为false
  const { songs, privileges, searchValue, startSearch, handleSongItemClick, currentSongId } = props
  // 存储的是结果的索引，而不是id
  const [searchIndexResult, setSearchIndexResult] = useState([])
  // 处理后的searchValue
  const [searchValueProcessed, setSearchValueProcessed] = useState('')
  // 搜索是否完成，“未找到与某某相关的内容”需要这个状态
  const [searchFinished, setSearchFinished] = useState(false)

  // 处理searchValue，去掉头尾空格，并小写
  useEffect(() => {
    setSearchValueProcessed(searchValue.trim().toLowerCase())
  }, [searchValue])

  // 搜索歌单内歌曲
  useEffect(() => {
    setSearchIndexResult([])
    if (searchValueProcessed === '') return
    setSearchFinished(false)
    if (!startSearch) return
    let result = []
    // 搜索范围为歌单内歌曲，包括歌曲名、别名、歌手名、专辑名
    songs.forEach((song, index) => {
      if (
        song.name.toLowerCase().includes(searchValueProcessed) ||
        (song.alia.length > 0 && song.alia[0]?.toLowerCase().includes(searchValueProcessed)) ||
        song.ar.some(item => {
          return item.name.toLowerCase().includes(searchValueProcessed)
        }) ||
        song.al.name.toLowerCase().includes(searchValueProcessed)
      ) {
        result.push(index)
      }
    })
    setSearchIndexResult(result)
    setSearchFinished(true)
  }, [searchValueProcessed, songs, startSearch])

  return (
    <div className="playlist-search-result">
      <div className="search-result">
        {searchIndexResult.map(indexItem => (
          <SongItem
            key={songs[indexItem].id}
            song={songs[indexItem]}
            privilege={privileges[indexItem]}
            handleSongItemClick={handleSongItemClick}
          >
            {currentSongId === songs[indexItem].id && <i className="iconfont icon-laba"></i>}
          </SongItem>
        ))}
        {searchValueProcessed !== '' && searchFinished && searchIndexResult.length === 0 && (
          <div className="not-find-notice">
            <p>未找到与"{searchValue}"相关的内容</p>
            <p>试试搜索云音乐曲库</p>
          </div>
        )}
        {searchValueProcessed !== '' && !searchFinished && (
          <div className="loading-notice">
            <img src={loadingSvg} alt="" className="loading" />
            <span>努力加载中...</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(PlaylistSearchResult)
