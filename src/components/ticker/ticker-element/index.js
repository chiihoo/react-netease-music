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

  const timerId1 = useRef()
  const timerId2 = useRef()

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
  useEffect(() => {
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
    const { width, height } = tickerElementRef.current.getBoundingClientRect()
    setElements(prevElements => [
      ...prevElements.map(item => {
        return {
          ...item,
          width,
          height
        }
      })
    ])
  }, [setElements])

  //  useRafLoop，通过设置x的位置，进行位移
  const [stopRaf, startRaf] = useRafLoop(timeDiff => {
    if (direction === 'toRight') {
      setX(prevX => prevX + (timeDiff * speed) / 100)
    } else {
      setX(prevX => prevX - (timeDiff * speed) / 100)
    }
  }, true)

  // 通过isMoving控制元素位移的停止与启动
  useEffect(() => {
    isMoving ? startRaf() : stopRaf()
    // eslint-disable-next-line
  }, [isMoving])

  // 根据tickerElement与ticker的width大小比较判断是否需要进行位移动画
  // 根据tickerElement滚动到的位置，来进行不同操作，包括判断是否应该创建新的tickerElement，或者删除原有的tickerElement
  const tickerActionHandler = useCallback(() => {
    if (!tickerElementWidth || !tickerWidth) return
    // 文字的width比盒子小的话，不位移，保持静止
    if (tickerElementWidth <= tickerWidth) {
      setIsMoving(false)
      // 由于初始的isMoving为true，可能在生成tickerElement之后有了一点位移，需要将X重置为0
      setX(0)
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
          timerId1.current = setTimeout(() => {
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
          timerId2.current = setTimeout(() => {
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

  // 运行tickerActionHandler
  useEffect(() => {
    tickerActionHandler()
  }, [tickerActionHandler])

  useEffect(() => {
    return () => {
      clearTimeout(timerId1.current)
      clearTimeout(timerId2.current)
    }
  }, [])

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
