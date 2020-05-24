import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useRafLoop } from '@/hooks'

const TickerElement = props => {
  const [x, setX] = useState(0)
  const [startPosX, setStartPosX] = useState()
  // 达到创建下一个元素的条件，但只能创建一次
  const [hasCreateNext, setHasCreateNext] = useState(false)
  // 元素位移至边界，需要停顿一下，再接着运行，但是判断是否位移至边界时，无法判断精确相等，只能在一定范围
  const [hasReachBorder, setHasReachBorder] = useState(false)

  const tickerElementRef = useRef()

  const {
    children,
    id,
    isFirst,
    setElements,
    direction,
    speed,
    stopDuration,
    isMoving,
    setIsMoving,
    tickerWidth,
    tickerElementWidth,
    childMargin,
    createTickerElement,
    deleteTickerElement
  } = props

  // 获取元素位移前的起始位置
  const getStartPosX = useCallback(() => {
    // startPosX为元素左侧位置，第一个元素都是贴着左边界
    // toRight 其余元素的右侧贴着父盒子的左边界
    // toLeft 其余元素的左侧贴着父盒子的右边界
    if (isFirst) {
      setStartPosX(0)
      return
    }
    direction === 'toRight' ? setStartPosX(-tickerElementWidth) : setStartPosX(tickerWidth)
  }, [direction, isFirst, tickerElementWidth, tickerWidth])

  // 设置元素宽高
  useEffect(() => {
    setElements(prevElements => [
      ...prevElements.map(item => {
        return {
          ...item,
          width: tickerElementRef.current.offsetWidth,
          height: tickerElementRef.current.offsetHeight
        }
      })
    ])
  }, [setElements])

  // 获取元素位移前的起始位置
  useEffect(() => {
    getStartPosX()
  }, [getStartPosX])

  //  useRafLoop，通过设置x的位置，进行位移
  const rafLoopHandle = useCallback(
    timeDiff => {
      if (direction === 'toRight') {
        setX(prevX => prevX + (timeDiff * speed) / 100)
      } else {
        setX(prevX => prevX - (timeDiff * speed) / 100)
      }
    },
    [direction, speed]
  )
  const [stopRaf, startRaf] = useRafLoop(rafLoopHandle, false)

  // 通过isMoving控制元素位移的停止与启动
  useEffect(() => {
    isMoving ? startRaf() : stopRaf()
  }, [isMoving, stopRaf, startRaf])

  // 根据tickerElement与ticker的width大小比较判断是否需要进行位移动画
  // 根据tickerElement滚动到的位置，来进行不同操作，包括判断是否应该创建新的tickerElement，或者删除原有的tickerElement
  const tickerActionHandle = useCallback(() => {
    if (!tickerElementWidth || !tickerWidth) return
    // 文字的width比盒子小的话，不位移，保持静止
    if (tickerElementWidth <= tickerWidth) {
      setIsMoving(false)
      return
    }
    // 方向向右
    if (direction === 'toRight') {
      // 第一个元素
      if (isFirst) {
        // 还没有触发过createNext并且达到了触发条件
        if (!hasCreateNext && x > childMargin) {
          createTickerElement()
          setHasCreateNext(true)
        }
        // 达到了删除条件
        if (x > tickerWidth + childMargin) {
          deleteTickerElement(id)
        }
      } else {
        // 不是第一个元素
        // 还没有触发过createNext并且达到了触发条件
        if (!hasCreateNext && x > tickerElementWidth + childMargin) {
          createTickerElement()
          setHasCreateNext(true)
        }
        // 达到了删除条件
        if (x > tickerElementWidth + tickerWidth + childMargin) {
          deleteTickerElement(id)
        }
        // 抵达左边界停顿
        if (!hasReachBorder && x - tickerElementWidth > 0) {
          setIsMoving(false)
          setHasReachBorder(true)
          setTimeout(() => {
            setIsMoving(true)
          }, stopDuration)
        }
      }
    } else {
      // 方向向左
      // 第一个元素
      if (isFirst) {
        // 还没有触发过createNext并且达到了触发条件
        if (!hasCreateNext && x < -(tickerElementWidth - tickerWidth + childMargin)) {
          createTickerElement()
          setHasCreateNext(true)
        }
        // 达到了删除条件
        if (x < -(tickerElementWidth + childMargin)) {
          deleteTickerElement(id)
        }
      } else {
        // 不是第一个元素
        // 还没有触发过createNext并且达到了触发条件
        if (!hasCreateNext && x < -(tickerElementWidth + childMargin)) {
          createTickerElement()
          setHasCreateNext(true)
        }
        // 达到了删除条件
        if (x < -(tickerElementWidth + tickerWidth + childMargin)) {
          deleteTickerElement(id)
        }
        // 抵达左边界停顿
        if (!hasReachBorder && x + tickerWidth < 0.5) {
          setIsMoving(false)
          setHasReachBorder(true)
          setTimeout(() => {
            setIsMoving(true)
          }, stopDuration)
        }
      }
    }
  }, [
    x,
    id,
    tickerElementWidth,
    tickerWidth,
    childMargin,
    stopDuration,
    direction,
    isFirst,
    hasCreateNext,
    hasReachBorder,
    createTickerElement,
    deleteTickerElement,
    setIsMoving
  ])

  // 运行tickerActionHandle
  useEffect(() => {
    tickerActionHandle()
  }, [tickerActionHandle])

  return (
    <div
      className="ticker-element"
      ref={tickerElementRef}
      style={{
        transform: `translate3d(${x}px,0,0)`,
        position: 'absolute',
        left: startPosX
      }}
    >
      {children}
    </div>
  )
}

export default React.memo(TickerElement)
