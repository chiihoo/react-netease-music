import React, { useState, useMemo, useCallback, useRef } from 'react'
import Slider from '@/components/slider'
import { formatTime } from '@/utils/tools'
import './index.scss'
import { useEffect } from 'react'

// 播放页面底部控制器
const PlayerController = props => {
  const {
    prevSong,
    nextSong,
    playMode,
    changePlayMode,
    isPlaying,
    changeIsPlaying,
    bufferedTime,
    totalTime,
    currentTime,
    changeTimeToPlay
  } = props

  const [time, setTime] = useState(currentTime) // 左侧显示的播放时间
  const isProgressTouch = useRef(false) // 进度条是否正在触摸滑动

  // 进度条会随着歌曲时间currentTime而逐步递进，进度条左侧也会显示当前的播放时间
  // 当手动滑动进度条时，进度条左侧会根据滑块的位置来显示要更改的播放时间
  // 当滑块滑动松手或者点击进度条时，会更改播放时间，并进行播放（取决于当前播放状态）

  // 具体做法是：设置一个叫time的state来控制进度条的左侧显示，使用钩子函数来设置是否在触摸滑块的状态isProgressTouch，
  // 如果不在touch状态，就把time设置成currentTime，如果在touchmove的状态，time的值就由进度条滑块的位置来决定，也就是stepCount，
  // 进度条的max={Math.floor(totalTime)}，step={1}，value={Math.floor(time)
  // 也就是最大值是总时间秒数，步长为1s，value就是步数stepCount，也就是当前播放时间。
  // 滑块滑动结束、点击进度条时的钩子函数为onAfterChange，这时候就需要更改播放时间并进行播放，
  // 做法是在onAfterChange钩子中对playerStore.timeToPlay这个状态进行改变，并在Audio组件中会对这个状态进行监听，
  // 如果有改变，就设置audioRef.current.currentTime = playerStore.timeToPlay，并进行播放

  // 之前有一个bug，我每次移动滑块完毕的时候，time都会突然跳回currentTime，原因是当时isProgressTouch是写成state形式的，
  // 每当移动滑块完毕，isProgressTouch改变为true，都会触发重新设置setTime(currentTime)
  // 解决办法是isProgressTouch改为ref形式的，改变不会触发重新渲染
  const formatTotalTime = useMemo(() => formatTime(totalTime), [totalTime])

  useEffect(() => {
    if (!isProgressTouch.current) {
      setTime(currentTime)
    }
  }, [currentTime])

  const onMoveStart = useCallback(() => {
    isProgressTouch.current = true
  }, [])

  // 进度条正在触摸滑动中
  const onMoving = useCallback(stepCount => {
    // 由进度条滑块的位置来控制time的值
    setTime(stepCount)
  }, [])

  // 进度条触摸滑动结束
  const onMoveEnd = useCallback(() => {
    isProgressTouch.current = false
  }, [])

  // 进度条改变stepCount完成，包括滑块滑动结束、点击进度条
  const onAfterChange = useCallback(
    stepCount => {
      // 设置需要更改的播放时间，并在Audio组件中进行设置并播放
      changeTimeToPlay(stepCount)
    },
    [changeTimeToPlay]
  )

  return (
    <div className="player-controller">
      <div className="slider-control">
        <div className="current-time">{formatTime(time)}</div>
        <div className="slider-wrapper">
          <Slider
            scale={2}
            max={Math.floor(totalTime)}
            value={Math.floor(time)}
            onMoveStart={onMoveStart}
            onMoving={onMoving}
            onMoveEnd={onMoveEnd}
            onAfterChange={onAfterChange}
            buffered={bufferedTime / totalTime}
          />
        </div>
        <div className="total-time">{formatTotalTime}</div>
      </div>

      <div className="play-control">
        <div className="play-mode">
          {playMode === 'list' && (
            <i className="iconfont icon-xunhuanbofang" onClick={() => changePlayMode('random')}></i>
          )}{' '}
          {playMode === 'random' && (
            <i className="iconfont icon-suijibofang" onClick={() => changePlayMode('single')}></i>
          )}
          {playMode === 'single' && (
            <i className="iconfont icon-danquxunhuan" onClick={() => changePlayMode('list')}></i>
          )}
        </div>
        <i className="iconfont icon-shangyiqu" onClick={() => prevSong()}></i>
        <div className="play-pause">
          {isPlaying === false ? (
            <i className="iconfont icon-bofang" onClick={() => changeIsPlaying(true)}></i>
          ) : (
            <i className="iconfont icon-zanting" onClick={() => changeIsPlaying(false)}></i>
          )}
        </div>
        <i className="iconfont icon-xiayiqu" onClick={() => nextSong()}></i>
        <i className="iconfont icon-caidan2"></i>
      </div>
    </div>
  )
}
export default React.memo(PlayerController)
