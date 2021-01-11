import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import Slider from '@/components/slider'
import toast from '@/components/toast'
import { formatTime } from '@/utils/tools'
import './index.scss'

// 播放页面底部控制器
const PlayerController = props => {
  const {
    prevSong,
    nextSong,
    playMode,
    changePlayMode,
    isPlaying,
    changePlayStatus,
    bufferedTime,
    totalTime,
    currentTime,
    changeTimeToPlay,
    showPlayListDrawer
  } = props

  // 进度条会随着歌曲时间currentTime而逐步递进
  // 在没有触摸滑块时，进度条左侧会显示当前的播放时间
  // 当触摸滑动滑块时，进度条左侧会根据滑块的位置来显示要更改的播放时间
  // 当滑块滑动松手或者点击进度条时，会更改播放时间，并进行播放（取决于当前播放状态）

  // 具体做法是：设置一个叫time的state来控制当前的播放时间，用value={Math.floor(time)}可以实时控制滑动输入条组件滑块的位置
  // 用一个叫做timeTemp的state来控制触摸滑动滑块时滑块对应的时间，即触摸滑块时进度条左侧显示的时间
  // 使用滑动输入条组件提供的钩子函数来设置是否在触摸滑块的状态isProgressTouch，
  // 如果不在touch状态，进度条左侧就显示time，如果在touchmove的状态，进度条左侧就显示timeTemp

  // 进度条的max={Math.floor(totalTime)}，step={1}，value={Math.floor(time)}
  // 也就是最大值是总时间秒数，步长为1s，value就是步数stepCount，也就是当前播放时间。
  // 滑块滑动结束、点击进度条时的钩子函数为onAfterChange，这时候就需要更改播放时间并进行播放，
  // 做法是在onAfterChange钩子中对audioRef.current.currentTime这个状态进行改变

  // 跟input range的区别：input range也有value，value可以控制input range的位置，同时滑动滑块也可以改变value的值
  // 滑动的过程中是不会改变value的，只有滑动完毕松手或者直接点击的时候才会把当前位置赋给value

  // 而我这个组件，提供了onAfterChange钩子，是在滑动完毕或直接点击时调用，更改播放时间currentTime
  // 在没有触摸滑块时，setTime(currentTime)改变了time，而value={Math.floor(time)}，则播放时间动态的控制了滑块的位置
  // 而onMoving钩子，用于在touchmove的时候，用滑块的位置动态的修改timeTemp，从而显示在进度条左侧

  // 之前有一个bug，我每次移动滑块完毕的时候，time都会突然跳回currentTime，原因是当时isProgressTouch是写成state形式的，
  // 每当移动滑块完毕，isProgressTouch改变为true，都会触发重新设置setTime(currentTime)
  // 解决办法是isProgressTouch改为ref形式的，改变不会触发重新渲染

  const [time, setTime] = useState(currentTime) // 当前歌曲播放时间
  const [timeTemp, setTimeTemp] = useState(currentTime) // 触摸滑块时，左侧显示的播放时间
  const isProgressTouch = useRef(false) // 进度条是否正在触摸滑动

  // 歌曲总时间
  const formatTotalTime = useMemo(() => formatTime(totalTime), [totalTime])

  // 进度条左侧时间，触摸滑块时为time，没有触摸滑块时为timeTemp
  const formatLeftTime = useMemo(() => formatTime(isProgressTouch.current ? timeTemp : time), [
    time,
    timeTemp
  ])

  useEffect(() => {
    // 这里只能在没有触摸滑块的情况下，给time赋值最新的播放时间，
    // 因为value={Math.floor(time)}，如果每次都赋值的话，会导致滑动输入条组件内部的stepCount一直接收到最新的value，导致滑块位置强制归位
    if (!isProgressTouch.current) {
      setTime(currentTime)
    }
  }, [currentTime])

  // 进度条触摸滑动开始
  const onMoveStart = useCallback(() => {
    isProgressTouch.current = true
  }, [])

  // 进度条正在触摸滑动中
  const onMoving = useCallback(stepCount => {
    // 在触摸滑动的时候，用滑块的位置来控制timeTemp的值，使进度条左侧在滑块触摸滑动时能实时显示当前滑块位置对应的值
    setTimeTemp(stepCount)
  }, [])

  // 进度条触摸滑动结束
  const onMoveEnd = useCallback(() => {
    isProgressTouch.current = false
  }, [])

  // 进度条改变stepCount完成，包括滑块滑动结束、点击进度条
  const onAfterChange = useCallback(
    stepCount => {
      // 设置需要更改的播放时间
      changeTimeToPlay(stepCount)
    },
    [changeTimeToPlay]
  )

  return (
    <div className="player-controller">
      <div className="slider-control">
        <div className="current-time">{formatLeftTime}</div>
        <div className="slider-wrapper">
          <Slider
            scale={2}
            max={totalTime > 0 ? Math.floor(totalTime) : 100}
            value={Math.floor(time)}
            onMoveStart={onMoveStart}
            onMoving={onMoving}
            onMoveEnd={onMoveEnd}
            onAfterChange={onAfterChange}
            buffered={totalTime !== 0 ? bufferedTime / totalTime : 0}
          />
        </div>
        <div className="total-time">{formatTotalTime}</div>
      </div>

      <div className="play-control">
        <div className="play-mode">
          {playMode === 'list' && (
            <i
              className="iconfont icon-xunhuanbofang"
              onClick={() => {
                changePlayMode('random')
                toast.info('随机播放')
              }}
            ></i>
          )}
          {playMode === 'random' && (
            <i
              className="iconfont icon-suijibofang"
              onClick={() => {
                changePlayMode('single')
                toast.info('单曲循环')
              }}
            ></i>
          )}
          {playMode === 'single' && (
            <i
              className="iconfont icon-danquxunhuan"
              onClick={() => {
                changePlayMode('list')
                toast.info('列表循环')
              }}
            ></i>
          )}
        </div>
        <i className="iconfont icon-shangyiqu" onClick={prevSong}></i>
        <div className="play-pause">
          {isPlaying === false ? (
            <i className="iconfont icon-bofang" onClick={() => changePlayStatus(true)}></i>
          ) : (
            <i className="iconfont icon-zanting" onClick={() => changePlayStatus(false)}></i>
          )}
        </div>
        <i className="iconfont icon-xiayiqu" onClick={nextSong}></i>
        <i className="iconfont icon-caidan2" onClick={showPlayListDrawer}></i>
      </div>
    </div>
  )
}
export default React.memo(PlayerController)
