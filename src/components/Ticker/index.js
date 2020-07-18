import React, { useState, useEffect, useRef, useCallback } from 'react'
import { guidGenerator } from '@/utils/tools'
import { useEventListener, useDebouncedCallback } from '@/hooks'
import TickerElement from './ticker-element'

/**
 * 歌单页面顶部header与mini播放栏歌名的横向无限循环滚动效果，类似marquee，但又不同
 * 参考了react-ticker库的实现，但是它没有提供文字当前滚动的位置，无法实现文字到达边缘后，停顿一会，又接着滚动
 * 并且前一个元素与后一个元素的间隔只能用空格来实现
 * 本组件对上述问题做了改进
 * @param {String} direction  'toRight' || 'toLeft', default: 'toLeft'
 * @param {Number} speed
 * @param {Number} childMargin 元素的间隔
 * @param {Boolean} move  控制ticker是否移动
 * @param {Number} stopDuration  元素到达左边界时停顿的时间
 * 需要给组件传递一个独特的key，保证点击不同数据时会重新初始化
 */

const Ticker = props => {
  const {
    children,
    direction = 'toLeft',
    speed = 3,
    childMargin = 50,
    move = true,
    stopDuration = 1500
  } = props

  const [elements, setElements] = useState([])
  const [isMoving, setIsMoving] = useState(true)
  const [tickerWidth, setTickerWidth] = useState(null)
  const [tickerHeight, setTickerHeight] = useState(null)

  const tickerRef = useRef()

  // 设置isMoving，用来控制组件是否停顿
  useEffect(() => {
    setIsMoving(move)
  }, [move])

  // 创建一个TickerElement并且运行
  const createTickerElement = useCallback(() => {
    setElements(prevElements => [
      ...prevElements,
      {
        id: guidGenerator(),
        isFirst: prevElements.length === 0,
        width: null,
        height: null
      }
    ])
  }, [])

  // tickerElement结束后，删除
  const deleteTickerElement = useCallback(id => {
    setElements(prevElements => prevElements.filter(item => item.id !== id))
  }, [])

  // 组件初始化时，添加一个元素
  useEffect(() => {
    createTickerElement()
    // eslint-disable-next-line
  }, [])

  // 当改变窗口大小时，重置
  const resizeHandler = useDebouncedCallback(() => {
    const { width } = tickerRef.current.getBoundingClientRect()
    setTickerWidth(width)
    setElements([])
    createTickerElement()
    setIsMoving(move)
  }, 100)

  useEventListener('resize', resizeHandler)

  // 设置tickerWidth
  useEffect(() => {
    const { width } = tickerRef.current.getBoundingClientRect()
    setTickerWidth(width)
  }, [])

  // 设置trickerHeight，由于.ticker是相对定位的，高度无法被撑起来，tickerRef.current.offsetHeight的值为0
  // 故需要用.ticker-element的高度计算，由于每个.ticker-element元素都是一样的，故高度取其中之一即可
  useEffect(() => {
    if (elements[0] && elements[0].height !== null) {
      setTickerHeight(elements[0].height)
    }
  }, [elements])

  return (
    <div
      className="ticker"
      ref={tickerRef}
      style={{
        overflow: 'hidden',
        position: 'relative',
        height: tickerHeight
      }}
    >
      {elements.map(item => (
        <TickerElement
          key={item.id}
          id={item.id}
          isFirst={item.isFirst}
          setElements={setElements}
          tickerWidth={tickerWidth}
          tickerElementWidth={item.width}
          direction={direction}
          speed={speed}
          childMargin={childMargin}
          stopDuration={stopDuration}
          isMoving={isMoving}
          setIsMoving={setIsMoving}
          createTickerElement={createTickerElement}
          deleteTickerElement={deleteTickerElement}
        >
          {children}
        </TickerElement>
      ))}
    </div>
  )
}

export default React.memo(Ticker)
