import React, { useEffect, useRef } from 'react'
import { observer } from 'mobx-react-lite'
import { useStores } from '@/stores'
import { useEventListener } from '@/hooks'

// Audio组件，常驻页面，控制音乐的播放
const Audio = observer(function Audio(props, ref) {
  const audioRef = useRef()

  const { playerStore } = useStores()

  const isFirstLoad = useRef(true)

  useEffect(() => {
    playerStore.setAudio(audioRef)
    // eslint-disable-next-line
  }, [])

  useEventListener(
    'play',
    () => {
      console.log('play：播放')
    },
    audioRef
  )
  useEventListener(
    'playing',
    () => {
      console.log('playing：正在播放')
    },
    audioRef
  )
  useEventListener(
    'pause',
    () => {
      console.log('pause：暂停')
    },
    audioRef
  )
  // 当浏览器正在下载指定的音频/视频时，会发生 progress 事件
  useEventListener(
    'progress',
    () => {
      console.log('progress：缓冲下载中')
      if (audioRef.current.buffered.length > 0) {
        const bufferedTime = audioRef.current.buffered.end(0) // 已缓存区域的时间
        playerStore.setBufferedTime(bufferedTime)
      }
    },
    audioRef
  )
  // 当浏览器能够开始播放指定的音频/视频时，发生 canplay 事件
  useEventListener(
    'canplay',
    () => {
      console.log('canplay，歌曲总时间为：', audioRef.current.duration)
      playerStore.setTotalTime(audioRef.current.duration)
    },
    audioRef
  )
  // 浏览器预计能够在不停下来进行缓冲的情况下持续播放指定的音频/视频时，会发生 canplaythrough 事件
  useEventListener(
    'canplaythrough',
    () => {
      console.log('canplaythrough')
    },
    audioRef
  )
  useEventListener(
    'timeupdate',
    () => {
      // console.log('currentTime：', audioRef.current.currentTime)
      playerStore.setCurrentTime(audioRef.current.currentTime)
    },
    audioRef
  )
  useEventListener(
    'ended',
    () => {
      console.log('ended')
      // 单曲循环在audio标签上设置了loop模式，其他播放模式直接下一首
      if (playerStore.playMode !== 'single') {
        playerStore.nextSong()
      }
    },
    audioRef
  )

  useEventListener(
    'stalled',
    () => {
      console.log('stalled：当浏览器尝试获取媒体数据，但数据不可用时触发。')
    },
    audioRef
  )
  useEventListener(
    'seeked',
    () => {
      console.log('seeked：当用户已移动/跳跃到音频/视频中的新位置时触发。')
    },
    audioRef
  )
  useEventListener(
    'error',
    e => {
      console.log('error：歌曲播放出错')
      playerStore.currentDirection === 'prev' ? playerStore.prevSong() : playerStore.nextSong()
    },
    audioRef
  )

  useEffect(() => {
    // 第一次加载的时候，调用playerStore.requestMusicUrl()，如果currentSongId不为undefined，则通过currentSongId来获取歌曲url，赋值给audio的src，但不播放
    // 主要针对的是歌曲播放信息的缓存，如果有缓存，则获取歌曲url，如果没缓存，则currentSongId为undefined，不会去请求
    if (isFirstLoad.current && playerStore.currentSongId) {
      playerStore.requestMusicUrl()
    }
    isFirstLoad.current = false
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    // 根据timeToPlay来设置当前播放时间
    if (playerStore.timeToPlay !== null) {
      audioRef.current.currentTime = playerStore.timeToPlay
      playerStore.setTimeToPlay(null)
    }
    // eslint-disable-next-line
  }, [playerStore.timeToPlay])

  useEffect(() => {
    if (!playerStore.currentSongId) return
    playerStore.getLyrics()
    // eslint-disable-next-line
  }, [playerStore.currentSongId])

  useEffect(() => {
    audioRef.current.volume = playerStore.volume
  }, [playerStore.volume])

  return (
    <>
      <audio
        ref={audioRef}
        preload="auto"
        crossOrigin="anonymous"
        loop={playerStore.playMode === 'single'}
      ></audio>
    </>
  )
})

export default React.memo(Audio)
