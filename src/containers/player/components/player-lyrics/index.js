import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import BScroll from '@better-scroll/core'
import classNames from 'classnames'
import { useEventListener, useDebouncedCallback } from '@/hooks'
import { formatTime } from '@/utils/tools'
import './index.scss'

// 播放页面歌词
const PlayerLyrics = props => {
  const {
    lyrics,
    lyricUser,
    transUser,
    changeTimeToPlay,
    hasLyric,
    isPureMusic,
    activeLyricIndex,
    showLyrics
  } = props

  const [halfHeight, setHalfHeight] = useState(0) // scrollWrapperRef.current盒子高度的一半
  const [showReadyLine, setShowReadyLine] = useState(false) // 是否显示readyLine

  const bScrollRef = useRef()
  const scrollWrapperRef = useRef()
  
  // 这两个变量主要是为了手动滑动时，不进行scrollToElement，否则就滑不动了
  const isScrolling = useRef(false) // 是否进行手动滑动
  const timerId = useRef() // 存setTimeout的id
  const lyricsRef = useRef([]) // 存储歌词li的dom元素
  // 手动滑动歌词，点击可以跳跃到该歌词的时间进行播放
  const lyricsHeightArr = useRef([]) // 每句歌词要被选中需要位移多少，比如第1句=0，第2句=height(1)，第3句=height(1)+height(2)，...
  const [readyPlayIndex, setReadyPlayIndex] = useState(0) // 预备播放的lyrics索引

  useEffect(() => {
    bScrollRef.current = new BScroll(scrollWrapperRef.current, {
      scrollY: true,
      click: true,
      mouseWheel: true,
      bounce: false,
      deceleration: 0.002, // momentum动画的减速度
      probeType: 3 // 派发scroll事件  1：非实时；2：实时；3：实时，在滚动动画时也会派发
    })
    return () => {
      bScrollRef.current && bScrollRef.current.destroy()
    }
  }, [])

  // 与better-scroll 1.15.2版本不同，加载数据变化需要重新进行刷新
  // 当lyrics或者halfHeight变化时，都需要调用bScrollRef.current.refresh()，因为dom发生了变化，需要重新计算BetterScroll
  useEffect(() => {
    bScrollRef.current && bScrollRef.current.refresh()
  }, [lyrics, halfHeight])

  // 触摸到滚动结束，isScrolling为true，注意要清除定时器
  const beforeScrollStartHandler = useCallback(() => {
    timerId.current && clearTimeout(timerId.current)
    isScrolling.current = true
    setShowReadyLine(true)
  }, [])

  const scrollEndHandler = useCallback(() => {
    // bScrollRef.current.scrollToElement也会触发'scrollEnd'，
    // 但是当isScrolling为true时，scrollToElement就没有被调用，所以没有影响
    isScrolling.current = false
    // 延时一段时间，才让readyLine消失
    timerId.current = setTimeout(() => {
      setShowReadyLine(false)
    }, 1000)
    return () => {
      timerId.current && clearTimeout(timerId.current)
    }
  }, [])

  // 将歌词界面切换到封面时，需要还原设置，设置为false
  useEffect(() => {
    if (!showLyrics) {
      isScrolling.current = false
      setShowReadyLine(false)
    }
  }, [showLyrics])

  useEffect(() => {
    bScrollRef.current.on('beforeScrollStart', beforeScrollStartHandler)
    bScrollRef.current.on('scrollEnd', scrollEndHandler)
    return () => {
      bScrollRef.current.off('beforeScrollStart', beforeScrollStartHandler)
      bScrollRef.current.off('scrollEnd', scrollEndHandler)
    }
  }, [beforeScrollStartHandler, scrollEndHandler])

  // 根据时间自动滚动到对应歌词位置
  useEffect(() => {
    if (!isScrolling.current && lyrics.length > 0) {
      bScrollRef.current.scrollToElement(lyricsRef.current[activeLyricIndex], 500, true, true)
    }
  }, [lyrics, activeLyricIndex])

  // 手动滑动歌词，点击可以跳跃到该歌词的时间进行播放
  // lyricsHeightArr.current存储每句歌词距离初始点的高度
  // 每句歌词要被选中需要位移多少，比如第1句=0，第2句=height(1)，第3句=height(1)+height(2)，...
  const calcHeightSum = useCallback(() => {
    let sum = 0
    for (let i = 0; i < lyrics.length; i++) {
      sum += lyricsRef.current[i].offsetHeight
      lyricsHeightArr.current[i] = sum
    }
  }, [lyrics.length])

  useEffect(() => {
    calcHeightSum()
  }, [calcHeightSum])

  // 由于padding百分比是由父元素的width计算而来，而我需要把歌词前后设置一半高度的空白，就需要用盒子的高度手动设置
  useEffect(() => {
    setHalfHeight(scrollWrapperRef.current.offsetHeight / 2)
  }, [])

  // resize处理
  const resizeHandler = useDebouncedCallback(() => {
    calcHeightSum()
    setHalfHeight(scrollWrapperRef.current.offsetHeight / 2)
  }, 100)

  useEventListener('resize', resizeHandler)

  // 监听bScroll的滚动事件，lyricsHeightArr.current从前往后遍历，第一个到初始点的高度 > -y的元素为预备播放的位置
  const scrollHandler = useCallback(({ y }) => {
    for (let i = 0; i < lyricsHeightArr.current.length; i++) {
      if (lyricsHeightArr.current[i] >= -y) {
        setReadyPlayIndex(i)
        return
      }
    }
  }, [])

  useEffect(() => {
    bScrollRef.current.on('scroll', scrollHandler)
    return () => {
      bScrollRef.current.off('scroll', scrollHandler)
    }
  }, [scrollHandler])

  // readyLine右侧的时间
  const readyPlayTime = useMemo(
    () => lyrics.length > 0 && formatTime(Math.floor(lyrics[readyPlayIndex]?.time / 1000)),
    [lyrics, readyPlayIndex]
  )

  return (
    <div className="player-lyrics">
      <div className="nolyric-notice">
        {isPureMusic ? <span>纯音乐，请欣赏</span> : !hasLyric && <span>暂时没有歌词</span>}
      </div>
      <div className="player-lyrics-scroll-wrapper" ref={scrollWrapperRef}>
        <ul style={{ padding: `${halfHeight}px 0` }}>
          {lyrics.map((item, index) => (
            <li
              key={item.time}
              className={classNames({
                'active-lyric': index === activeLyricIndex,
                'ready-play': index === readyPlayIndex && index !== activeLyricIndex
              })}
              ref={el => {
                lyricsRef.current[index] = el
              }}
            >
              <p>{item.lyric}</p>
              <p>{item.tlyric}</p>
            </li>
          ))}
          {lyrics.length > 0 && (
            <li className="lyric-trans-user">
              {lyricUser && <p>歌词贡献者：{lyricUser}</p>}
              {transUser && <p>翻译贡献者：{transUser}</p>}
            </li>
          )}
        </ul>
      </div>

      {showReadyLine && lyrics.length > 0 && (
        <div
          className="lyrics-ready-line-wrapper"
          onClick={e => {
            e.stopPropagation()
            changeTimeToPlay(lyrics[readyPlayIndex].time / 1000)
            setShowReadyLine(false)
          }}
        >
          <i className="iconfont icon-bofang1"></i>
          <div className="lyrics-ready-line"></div>
          <span className="lyrics-ready-time">{readyPlayTime}</span>
        </div>
      )}
    </div>
  )
}

export default React.memo(PlayerLyrics)
