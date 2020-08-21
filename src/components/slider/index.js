import React, { useRef, useState, useEffect } from 'react'
import { useEventListener } from '@/hooks'
import './index.scss'

// 滑动输入条组件，在播放页面有使用
const Slider = props => {
  const {
    min = 0, // 最小值
    max = 100, // 最大值
    step = 1, // 步长，需要能被max-min整除
    value = 0, // 相对min和max的当前值，比如max为歌曲总时长s，那么value就可以设为歌曲的当前时间s
    scale = 1, // 滑块touch事件时会scale多少倍
    buffered = 0, // 缓冲进度
    lineColor = 'rgba(255, 255, 255, 0.2)', // 线条背景色
    bufferedColorRange = 'rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)', // 缓冲区域的颜色，可以渐变
    progressColorRange = '#95c1de, #95c1de', // 已经过区域的颜色
    onMoveStart, // touchstart
    onMoving, // touchmove
    onMoveEnd, // touchend
    onAfterChange // touchend和click
  } = props

  const [posX, setPosX] = useState() // 当前滑块的位置
  const [isScale, setIsScale] = useState(false) // 触摸滑块时，滑块会放大
  const [stepCount, setStepCount] = useState(value) // stepCount：距离最左侧有几个step的距离

  const prevPosX = useRef() // 上一次touchend时滑块的位置
  const touchStartX = useRef() // 触摸开始时触点的位置
  const stepLength = useRef() // 每一个step相对于进度条上的距离 = 进度条总长 / (max - min)

  const lineWidth = useRef() // line的width
  const lineLeft = useRef() // line距离视口左端的距离

  const lineRef = useRef()
  const circleRef = useRef()

  // 初始化
  useEffect(() => {
    // 获取lineRef.current距离视口左边的距离
    const { width, left } = lineRef.current.getBoundingClientRect()
    lineWidth.current = width
    lineLeft.current = left
    // 计算每步的实际长度
    stepLength.current = lineWidth.current * (step / (max - min))
    // 计算当前位置并存储
    const currPosx = stepLength.current * stepCount
    prevPosX.current = currPosx
    setPosX(currPosx)
    // eslint-disable-next-line
  }, [min, max, step])

  // 当改变窗口大小时，重置
  useEventListener('resize', () => {
    const { width, left } = lineRef.current.getBoundingClientRect()
    lineWidth.current = width
    lineLeft.current = left
    stepLength.current = lineWidth.current * (step / (max - min))
    const currPosx = stepLength.current * stepCount
    prevPosX.current = currPosx
    setPosX(currPosx)
  })

  // 把props传来的value设置到状态stepCount上
  // 这里是为了在不滑动滑块的情况下，通过改变value来改变滑块的位置。应用场景是，滑块自动跟随播放时间滑动
  useEffect(() => {
    setStepCount(value)
  }, [value])

  // 监听stepCount，只要变化就更新滑块位置posX
  useEffect(() => {
    if (stepCount <= 0) {
      setPosX(0)
    } else if (stepCount >= max - min) {
      setPosX(lineWidth.current)
    } else {
      setPosX(stepLength.current * stepCount)
    }
  }, [stepCount, min, max])

  useEventListener(
    'touchstart',
    e => {
      touchStartX.current = e.touches[0].clientX
      prevPosX.current = posX
      setIsScale(true)
      if (typeof onMoveStart === 'function') {
        onMoveStart(stepCount)
      }
    },
    circleRef
  )

  useEventListener(
    'touchmove',
    e => {
      // 只需要滑动stepLength.current的一半，就移动滑块一步
      const currPosX =
        prevPosX.current +
        stepLength.current *
          Math.round((e.touches[0].clientX - touchStartX.current) / stepLength.current)

      let stepCountTemp
      if (currPosX < 0) {
        stepCountTemp = 0
      } else if (currPosX > lineWidth.current) {
        stepCountTemp = (max - min) / step
      } else {
        stepCountTemp = Math.round(currPosX / stepLength.current)
      }
      setStepCount(stepCountTemp)
      if (typeof onMoving === 'function') {
        onMoving(stepCountTemp)
      }
    },
    circleRef
  )

  useEventListener(
    'touchend',
    e => {
      prevPosX.current = posX
      setIsScale(false)
      if (typeof onMoveEnd === 'function') {
        onMoveEnd(stepCount)
      }
      if (typeof onAfterChange === 'function') {
        onAfterChange(stepCount)
      }
    },
    circleRef
  )

  useEventListener(
    'click',
    e => {
      e.stopPropagation()
      const currStepCount = Math.round((e.clientX - lineLeft.current) / stepLength.current)
      prevPosX.current = stepLength.current * currStepCount
      setStepCount(currStepCount)
      if (typeof onAfterChange === 'function') {
        onAfterChange(currStepCount)
      }
    },
    lineRef
  )

  return (
    <div className="slider">
      {/* 缓冲进度 */}
      <div
        className="bufferd-line"
        style={{
          background: `linear-gradient(${bufferedColorRange}) no-repeat`,
          backgroundSize: `${buffered * 100}% 100%`
        }}
      >
        {/* 播放进度 */}
        <div
          className="line"
          ref={lineRef}
          style={{
            background: `linear-gradient(${progressColorRange}) no-repeat ${lineColor}`,
            backgroundSize: `${(stepCount / (max - min)) * 100}% 100%`
          }}
        ></div>
      </div>
      <div
        className="circle-wrapper"
        ref={circleRef}
        style={{
          transform: `translateX(${posX}px)`
        }}
      >
        <div
          className="circle"
          style={{
            transform: isScale && `scale(${scale})`
          }}
        ></div>
      </div>
    </div>
  )
}
export default React.memo(Slider)
