import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useEventListener } from '@/hooks'
import './index.scss'

const Scroll = props => {
  const [touchStart, setTouchStart] = useState(0) // 触摸起始位置，当isTop从false变为true，需重新赋值
  const [slideDistance, setSlideDistance] = useState(0) // 滑块实际需要滑动的距离，需要乘以适当系数
  const [isTop, setIsTop] = useState(true) // 是否触顶
  const [isBottom, setIsBottom] = useState(false) // 是否触底
  const [isTouchEnd, setIsTouchEnd] = useState(true) //是否释放触摸
  const [isStartPull, setIsStartPull] = useState(false) // isTop为true后，设为ture，同时设置一次touchStart初始位置
  const [isRefreshReady, setIsRefreshReady] = useState(false) // 是否达到刷新界限（释放触摸+拉动距离达标）
  const [isRefreshing, setIsRefreshing] = useState(false) // 是否正在刷新
  const [showLoadingIcon, setShowLoadingIcon] = useState(true) // 是否展示loading图标，停止展示-复位-重新展示，这是为了避免刷新结束时，loading图标复位出现渐变轨迹
  const [showRefreshTips, setShowRefreshTips] = useState(false) // 刷新完毕，展示Tips
  const [reqTime, setReqTime] = useState(Date.now()) // 记录请求发出的时间
  const [isLoading, setIsLoading] = useState(false) // 是否正在进行下拉加载的请求

  const scrollRef = useRef()

  // 保存定时器id，并在组件卸载时统一clearTimeout
  const timerIdRef1 = useRef()
  const timerIdRef2 = useRef()
  const timerIdRef3 = useRef()
  const timerIdRef4 = useRef()

  // loadingStatus传递页面初始加载时的加载状态，可以控制初始加载时tips的显示消失，跟pullDown和pullUp无关
  // 约定loadingStatus： 0：未发起请求； 1：正在请求； 2：请求完毕
  // tips为请求完成时，显示的文字
  // pullDown和pullUp各有callback，同时也有loadingStatus
  // callback是进行刷新或加载的网络请求的函数
  // pullDown.loadingStatue传递下拉刷新请求的加载状态，也可以控制tips的显示消失
  // pullUp.loadingStatue传递上拉加载请求的加载状态
  const {
    children,
    initialScrollTop,
    loadingStatus,
    tips = '已为您推荐个性化内容',
    pullDown = {},
    pullUp = {},
    getScrollElement,
    onScrollFn,
    refreshThreshold = 70, // 下拉达到刷新的距离界限 70 (以375px屏幕为例)
    touchThreshold = 132, // 滑块最多滑动到的距离 132
    loadingStop = 70, // 下拉刷新 loading时，滑块停留的位置 70
    tipsStop = 50, // tips停留的位置 50
    ratio = 2.67 // 375的屏幕是2.67，1024的屏幕是0.98，这个系数是要乘以下拉的距离，来得到旋转的角度。屏幕越大，下拉距离也越大
  } = props

  // 切换路由时页面可能需要缓存，此处可以还原滚动位置
  useEffect(() => {
    if (initialScrollTop) {
      scrollRef.current.scrollTo(0, initialScrollTop)
    }
    // eslint-disable-next-line
  }, [])

  // 获取scroll的container dom
  useEffect(() => {
    getScrollElement && getScrollElement(scrollRef.current)
  }, [getScrollElement])

  // 如果传入了onScrollFn，则监听scroll事件
  useEffect(() => {
    const element = scrollRef.current
    if (onScrollFn) {
      element.addEventListener('scroll', onScrollFn)
      return () => {
        element.removeEventListener('scroll', onScrollFn)
      }
    }
  }, [onScrollFn])

  const touchStartHandler = useCallback(
    e => {
      setTouchStart(e.touches[0].clientY)
      // 下拉刷新
      if (!isRefreshing) {
        setIsTouchEnd(false)
      }
    },
    [isRefreshing]
  )

  const touchMoveHandler = useCallback(
    e => {
      // 是否触顶
      setIsTop(scrollRef.current.scrollTop === 0)
      // 是否触底
      setIsBottom(
        scrollRef.current.scrollTop + scrollRef.current.offsetHeight + 5 >=
          scrollRef.current.scrollHeight
      )

      // 取消浏览器的默认下拉行为，比如手机QQ浏览器，会显示"已启用QQ浏览器X5内核"字样，且与自定义下拉刷新操作冲突
      // 而要取消浏览器自身的下拉刷新操作，如手机chrome浏览器，只需要给body标签增加overflow: hidden;
      // 触顶，且有下拉动作，取消默认行为
      if (isTop && e.touches[0].clientY > touchStart) {
        // e.cancelable===false的时候无法取消touchmove事件，会报错
        e.cancelable && e.preventDefault()
      }

      // 下拉刷新
      if (pullDown.callback && isTop && !isRefreshing) {
        // 在isTop每次由false变为true的时候，都要设置一次touchStart，因为触摸的距离是大于滑块实际滑动的距离的
        // 用isStatePull这个状态来保证每次isTop切换成true的时候，只会设置一次touchStart
        if (!isStartPull) {
          setTouchStart(e.touches[0].clientY)
          setIsStartPull(true)
        } else {
          const diff = e.touches[0].clientY - touchStart
          if (0 <= diff && diff < refreshThreshold) {
            // 没有拉到刷新的界限
            setSlideDistance(diff) // 滑块实际滑动距离
            setIsRefreshReady(false) // isRefreshReady为false时，滑块opacity为0.5，释放后归位
          } else if (refreshThreshold <= diff && diff < touchThreshold) {
            // 拉到可以刷新的界限，并且最多拉到TOUCH_THRESHOLD
            setSlideDistance(diff) // 滑块实际滑动距离
            setIsRefreshReady(true) // isRefreshReady为true时，滑块opacity为1，释放后停留loading
          }
        }
      }

      // 上拉加载
      if (pullUp.callback && isBottom && !isLoading) {
        // 触底，没有正在进行加载请求，并且有上拉的动作，就进行上拉加载请求
        if (e.touches[0].clientY - touchStart < -10) {
          setIsLoading(true)
          pullUp.callback()
        }
      }
    },
    [
      refreshThreshold,
      touchThreshold,
      isBottom,
      isLoading,
      isRefreshing,
      isStartPull,
      isTop,
      pullDown.callback,
      pullUp,
      touchStart
    ]
  )

  const touchEndHandler = useCallback(
    e => {
      // 下拉刷新
      if (pullDown.callback && !isRefreshing) {
        // 触摸结束时，isTouchEnd设置为true，也就是释放的时候才给滑块设置transition: transform 0.2s
        setIsTouchEnd(true)
        setIsStartPull(false)
        if (!isRefreshReady) {
          // 没下拉到可以刷新的位置，触摸结束时，就把滑块归位，否则触发刷新流程
          setSlideDistance(0)
        } else {
          // 下拉到已经可以刷新的位置，触摸结束时，就把滑块停留到loadingStop的位置，并且setIsRefreshing(true)
          setSlideDistance(loadingStop)
          // isRefreshing:true -> 换成动态loading图标
          setIsRefreshing(true)
          // 设置网络请求发出的时间，因为如果请求返回的速度很快的话，loading图标一闪就没了，需要适当延长时间
          setReqTime(Date.now())
          // 回调函数 进行刷新所需要的网络请求
          pullDown.callback()
        }
      }
    },
    [loadingStop, isRefreshReady, isRefreshing, pullDown]
  )

  // 触摸开始
  useEventListener('touchstart', touchStartHandler, scrollRef.current)

  // 触摸进行中
  useEventListener('touchmove', touchMoveHandler, scrollRef.current)

  // 触摸结束
  useEventListener('touchend', touchEndHandler, scrollRef.current)

  // 下拉刷新
  // 网络请求完成后，需要进行的收尾工作
  const finishPullDown = useCallback(() => {
    // 加载完成后，loading图标复位。需要先把loading图标消除，再把slideDistance置为0，否则会有归位的动画
    setShowLoadingIcon(false)
    setSlideDistance(0)
    setShowLoadingIcon(true)
    // isRefreshReady:false -> opacity:0.5
    setIsRefreshReady(false)
    // isRefreshing:true -> 换成动态loading图标
    setIsRefreshing(false)
    // 适当调整tips出现的时机
    timerIdRef1.current = setTimeout(() => {
      setShowRefreshTips(true)
    }, 700)
    timerIdRef2.current = setTimeout(() => {
      setShowRefreshTips(false)
    }, 2000)
  }, [])

  // 下拉刷新
  // 监听loadingStatus，当网络请求进行完毕时，调用finishPullDown()
  // 同时，如果网络请求很快就完成了，loading图标就会一闪而过，这就需要适当延长loading图标显示的时间
  // 初次加载 和 下拉加载 都要finishPullDown()，以此来触发显示 "已为您推荐个性化内容" 的tips
  // 初次加载loadingStatus，下拉加载pullDown.loadingStatus
  useEffect(() => {
    // loadingStatus 约定：  0：未发起请求； 1：正在请求； 2：请求完毕
    if (loadingStatus === 2 || (pullDown.callback && pullDown.loadingStatus === 2)) {
      const timeDiff = Date.now() - reqTime
      if (timeDiff < 1500) {
        timerIdRef3.current = setTimeout(() => {
          finishPullDown()
        }, 1500 - timeDiff)
      } else {
        finishPullDown()
      }
    }
  }, [loadingStatus, pullDown.callback, pullDown.loadingStatus, finishPullDown, reqTime])

  // 上拉加载
  useEffect(() => {
    if (isLoading && pullUp.loadingStatus === 2) {
      // 减少上拉加载的请求频率，避免在touchmove上拉动作的时候，短时间内连续触发pullUp.callback，需要稍微放大点间隔时间
      timerIdRef4.current = setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    }
  }, [isLoading, pullUp.loadingStatus])

  // 组件卸载时，删除定时器
  useEffect(() => {
    return () => {
      clearTimeout(timerIdRef1.current)
      clearTimeout(timerIdRef2.current)
      clearTimeout(timerIdRef3.current)
      clearTimeout(timerIdRef4.current)
    }
  }, [])

  return (
    <div className="scroll" ref={scrollRef}>
      {pullDown.callback && (
        <div className="pulldown-refresh">
          {showLoadingIcon && (
            <div
              className="icon-wrapper"
              style={{
                transform: `translateY(${slideDistance}px)`,
                // 没有达到刷新距离，以及达到刷新距离，松手时isTouchEnd都为true
                transition: isTouchEnd && 'transform 0.2s'
              }}
            >
              {!isRefreshing ? (
                <>
                  <img
                    className="loading-in"
                    src={require('@/assets/svgIcons/refresh-loading-in.svg')}
                    style={{
                      transform: `rotate(${-slideDistance * ratio}deg)`,
                      opacity: isRefreshReady ? 1 : 0.5
                    }}
                    alt=""
                  />
                  <img
                    className="loading-out"
                    src={require('@/assets/svgIcons/refresh-loading-out.svg')}
                    style={{
                      transform: `rotate(${slideDistance * ratio}deg)`,
                      opacity: isRefreshReady ? 1 : 0.5
                    }}
                    alt=""
                  />
                </>
              ) : (
                <img src={require('@/assets/svgIcons/refresh-loading.svg')} alt="" />
              )}
            </div>
          )}
        </div>
      )}
      <div className="refresh-tips">
        <span
          style={{
            transform: showRefreshTips && `translateY(${tipsStop}px)`
          }}
        >
          {tips}
        </span>
      </div>
      {children}
    </div>
  )
}

export default React.memo(Scroll)
