import React, { useState, useEffect, useCallback } from 'react'
import { useObserver } from 'mobx-react-lite'
import { useStores } from '@/stores'
import PlayerHeader from './components/player-header'
import PlayerController from './components/player-controller'
import PlayerLyrics from './components/player-lyrics'
import PlayerVolume from './components/player-volume'
import AudioAnimation from './components/audio-animation'
import { imgBlurToBase64 } from '@/utils/tools'
import './index.scss'

// 播放页面
const Player = () => {
  const { playerStore } = useStores()

  const [blurCoverImageUrl, setBlurCoverImageUrl] = useState()
  const [showLyrics, setShowLyrics] = useState(false)

  useEffect(() => {
    ;(async function () {
      if (playerStore.currentSong.al.picUrl) {
        const imgUrl = await imgBlurToBase64(
          playerStore.currentSong.al.picUrl + '?param=200y200',
          50
        )
        setBlurCoverImageUrl(imgUrl)
      }
    })()
  }, [playerStore.currentSong.al.picUrl])

  // 如果要向下层组件传递mobx的方法的话，直接传递会因为this的存在导致报错
  const prevSong = useCallback(() => {
    playerStore.prevSong()
    // eslint-disable-next-line
  }, [])
  const nextSong = useCallback(() => {
    playerStore.nextSong()
    // eslint-disable-next-line
  }, [])
  const changePlayMode = useCallback(mode => {
    playerStore.changePlayMode(mode)
    // eslint-disable-next-line
  }, [])
  const changeIsPlaying = useCallback(status => {
    playerStore.setIsPlaying(status)
    // eslint-disable-next-line
  }, [])
  const changeCurrentTime = useCallback(time => {
    playerStore.setCurrentTime(time)
    // eslint-disable-next-line
  }, [])
  const changeTimeToPlay = useCallback(time => {
    playerStore.setTimeToPlay(time)
    // eslint-disable-next-line
  }, [])
  const changeVolume = useCallback(volume => {
    playerStore.setVolume(volume)
    // eslint-disable-next-line
  }, [])
  const updateDataArray = useCallback(() => {
    playerStore.updateDataArray()
    // eslint-disable-next-line
  }, [])

  return useObserver(() => (
    <div className="player">
      <div className="player-bg-img" style={{ backgroundImage: `url(${blurCoverImageUrl})` }}></div>
      <div className="player-masking-layer"></div>
      <PlayerHeader song={playerStore.currentSong} />
      <div className="player-cover-lyrics-wrapper" onClick={() => setShowLyrics(value => !value)}>
        <div
          className="player-cover-animation-wrapper"
          style={{ visibility: showLyrics ? 'hidden' : 'visible' }}
        >
          <AudioAnimation
            updateDataArray={updateDataArray}
            dataArray={playerStore.dataArray}
            picUrl={playerStore.currentSong.al.picUrl}
            isPlaying={playerStore.isPlaying}
          />
        </div>
        <div
          className="player-lyrics-scroll-wrapper"
          style={{ visibility: showLyrics ? 'visible' : 'hidden' }}
        >
          <PlayerVolume volume={playerStore.volume} changeVolume={changeVolume} />
          <div className="player-lyrics-wrapper">
            <PlayerLyrics
              isPureMusic={playerStore.isPureMusic}
              hasLyric={playerStore.hasLyric}
              lyrics={playerStore.lyrics}
              lyricUser={playerStore.lyricUser}
              transUser={playerStore.transUser}
              activeLyricIndex={playerStore.activeLyricIndex}
              changeTimeToPlay={changeTimeToPlay}
            />
          </div>
        </div>
      </div>

      <div className="player-controller-wrapper">
        <PlayerController
          prevSong={prevSong}
          nextSong={nextSong}
          changePlayMode={changePlayMode}
          playMode={playerStore.playMode}
          changeIsPlaying={changeIsPlaying}
          isPlaying={playerStore.isPlaying}
          bufferedTime={playerStore.bufferedTime}
          totalTime={playerStore.totalTime}
          currentTime={playerStore.currentTime}
          changeCurrentTime={changeCurrentTime}
          changeTimeToPlay={changeTimeToPlay}
        />
      </div>
    </div>
  ))
}

export default React.memo(Player)
