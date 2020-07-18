import React, { useState, useRef, useEffect, useCallback } from 'react'
import BetterScroll from 'better-scroll'
import './index.scss'

// "better-scroll": "^1.15.2"
// 本项目没有使用本组件

// const THRESHOLD = 90
// const STOP = 40
// 写在配置中的数字默认是px单位，无法自适应，所以通过下述方式模拟vw
const THRESHOLD = window.innerWidth * 0.24
const STOP = window.innerWidth * 0.107

// better-scroll封装的滚动组件
const BScroll = props => {
  const [beforePullDown, setBeforePullDown] = useState(true) //是否下拉释放之前
  const [releaseRefresh, setReleaseRefresh] = useState(false) //是否已经下拉了可以下拉释放刷新的距离
  const [isPullingDown, setIsPullingDown] = useState(false) //是否下拉释放，已触发刷新
  const [isPullingUp, setIsPullingUp] = useState(false) //是否上拉已触发加载

  const scrollElementRef = useRef()
  const scrollInstanceRef = useRef()

  const {
    children,
    pullDown, // 下拉刷新函数
    pullUp, // 上拉加载函数
    pullDownConfig = {
      threshold: THRESHOLD, // 配置顶部下拉的距离来决定刷新时机
      stop: STOP // 回弹停留的距离
    },
    pullUpConfig = {
      threshold: 0 // 触发上拉事件的阈值
    }
  } = props

  // 初始化
  useEffect(() => {
    scrollInstanceRef.current = new BetterScroll(scrollElementRef.current, {
      scrollY: true,
      click: true, // 允许点击事件
      mouseWheel: true, // 允许鼠标滚轮控制滚动
      probeType: 2, // 派发scroll事件  1：非实时；2：实时；3：实时，在滚动动画时也会派发
      bounce: {
        top: pullDown ? true : false, // 只有在需要下拉刷新时才开启顶部回弹
        bottom: pullUp ? true : false // 只有在需要下拉加载时才开启底部回弹
      },
      pullDownRefresh: pullDown ? pullDownConfig : false,
      pullUpLoad: pullUp ? pullUpConfig : false
    })
    return () => {
      scrollInstanceRef.current && scrollInstanceRef.current.destroy()
      scrollInstanceRef.current = null
    }
    // eslint-disable-next-line
  }, [])

  // 下拉超过一定距离，显示：松开刷新
  useEffect(() => {
    if (scrollInstanceRef.current && pullDown) {
      scrollInstanceRef.current.on('scroll', pos => {
        setReleaseRefresh(pos.y > THRESHOLD)
      })
      return () => {
        scrollInstanceRef.current.off('scroll')
      }
    }
  }, [pullDown])

  // 下拉达到可以刷新的距离，松手触发
  const pullingDownHandler = useCallback(async () => {
    setBeforePullDown(false)
    setIsPullingDown(true)
    //下拉刷新数据
    await pullDown()
    // 下拉过程结束，进入回弹状态，显示：刷新中
    // 刷新好了，显示：刷新完毕
    // 之后展示700毫秒后，才开始回弹
    setIsPullingDown(false)
    await new Promise(resolve => {
      setTimeout(() => {
        scrollInstanceRef.current.finishPullDown()
        scrollInstanceRef.current.refresh()
        resolve()
      }, 700)
    })
    // 要等回弹完毕，才把提示文字从刷新完毕替换为下拉刷新，这里的时间要大于回弹的时间
    setTimeout(() => {
      setBeforePullDown(true)
    }, 500)
  }, [pullDown])

  // 上拉加载过程
  const pullingUpHandler = useCallback(async () => {
    setIsPullingUp(true)
    // 上拉加载数据
    await pullUp()
    scrollInstanceRef.current.finishPullUp()
    scrollInstanceRef.current.refresh()
    setIsPullingUp(false)
  }, [pullUp])

  // 监听下拉加载
  useEffect(() => {
    if (scrollInstanceRef.current && pullDown) {
      scrollInstanceRef.current.on('pullingDown', pullingDownHandler)
      return () => {
        scrollInstanceRef.current.off('pullingDown', pullingDownHandler)
      }
    }
  }, [pullDown, pullingDownHandler])

  // 监听上拉刷新
  useEffect(() => {
    if (scrollInstanceRef.current && pullUp) {
      scrollInstanceRef.current.on('pullingUp', pullingUpHandler)
      return () => {
        scrollInstanceRef.current.off('pullingUp', pullingUpHandler)
      }
    }
  }, [pullUp, pullingUpHandler])

  return (
    <div className="bscroll" ref={scrollElementRef}>
      <div className="bscroll-content">
        {children}
        {pullDown && (
          <div className="pulldown-refresh">
            {beforePullDown ? (
              <>
                <i
                  className="iconfont icon-xialashuaxin"
                  style={{
                    transform: releaseRefresh && 'rotate(180deg)'
                  }}
                ></i>
                {releaseRefresh ? <span>松开刷新</span> : <span>下拉刷新</span>}
              </>
            ) : (
              <div>
                {isPullingDown ? (
                  <>
                    <img
                      src={require('@/assets/svgIcons/loading.svg')}
                      alt="svg-loading"
                      className="svg-loading"
                    ></img>
                    <span>刷新中...</span>
                  </>
                ) : (
                  <span>刷新完毕</span>
                )}
              </div>
            )}
          </div>
        )}
        {pullUp && (
          <div className="pullup-load">
            {isPullingUp ? (
              <>
                <img
                  src={require('@/assets/svgIcons/loading.svg')}
                  alt="svg-loading"
                  className="svg-loading"
                ></img>
                <span>加载中...</span>
              </>
            ) : (
              <span>上拉加载</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default React.memo(BScroll)
