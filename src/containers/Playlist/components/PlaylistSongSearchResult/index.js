import React, { useState, useEffect } from 'react'
import SongItem from '@/components/SongItem'
import './index.scss'

// 由于"播放全部"这行需要将header背景图片的下端盖住，以保证填充圆弧部分，
// 故header的z-index要比"播放全部"低
// 所以这个搜索结果不能放在PlaylistHeader组件中，否则无法将"播放全部"盖在底下

// PlaylistHeader搜索的结果
const PlaylistSongSearchResult = props => {
  const { songsData, searchValue, startSearch } = props
  // 存储的是结果的索引，而不是id
  const [searchResult, setSearchResult] = useState([])
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
    if (searchValueProcessed === '') {
      setSearchResult([])
      return
    }
    setSearchFinished(false)
    if (!startSearch) return
    let result = []
    // 搜索范围为歌单内歌曲，包括歌曲名、别名、歌手名、专辑名
    songsData.songs.forEach((song, index) => {
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
    setSearchResult(result)
    setSearchFinished(true)
  }, [searchValueProcessed, songsData.songs, startSearch])

  return (
    <div className="playlist-song-search-result">
      <div className="search-result">
        {searchResult
          .map(item => songsData.songs[item])
          .map((item, index) => (
            <SongItem key={item.id} song={item} privilege={songsData.songs[index]} />
          ))}

        {searchResult.length === 0 && searchValueProcessed !== '' && searchFinished && (
          <div className="not-find-notice">
            <p>未找到与"{searchValue}"相关的内容</p>
            <p>试试搜索云音乐曲库</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(PlaylistSongSearchResult)
