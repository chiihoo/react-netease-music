import React, { useState, useEffect, useRef, useCallback, useImperativeHandle } from 'react'
import { useEventListener } from '@/hooks'
import './index.scss'

// 滚动组件，包括下拉刷新
const Scroll = React.forwardRef((props, ref) => {
  // 与dom变换有关的需要触发重新渲染的，放在state里面
  const [slideLength, setSlideLength] = useState(0) // 滑块实际需要滑动的距离
  const [isTouchEnd, setIsTouchEnd] = useState(true) //是否释放触摸
  const [isRefreshReady, setIsRefreshReady] = useState(false) // 是否达到刷新界限（释放触摸+拉动距离达标）
  const [isRefreshing, setIsRefreshing] = useState(false) // 是否正在刷新
  const [showLoadingIcon, setShowLoadingIcon] = useState(true) // 是否展示loading图标，停止展示-复位-重新展示，这是为了避免刷新结束时，loading图标复位出现渐变轨迹
  const [showRefreshTips, setShowRefreshTips] = useState(false) // 刷新完毕，展示Tips
  const [scrollLock, setScrollLock] = useState(false) // 如果scroll区域刚开始不是isTop，而是下拉到达isTop，之后继续下拉，而此时如果上滑会带动scroll区域上滑，所以需要设置overflow:hidden来避免该问题

  // 跟dom重新渲染无直接关系的变量就可以放到ref里面
  const touchStart = useRef(0) // 触摸起始位置，当isTop从false变为true，需重新赋值
  const isTop = useRef(true) // 是否触顶
  const isBottom = useRef(false) // 是否触底
  const isStartPull = useRef(false) // isTop为true后，设为ture，同时设置一次touchStart初始位置
  const isFirstLoad = useRef(true) // 记录是否为第一次的初始加载，只展示一次Tips
  const isLoading = useRef(false) // 是否正在进行上拉加载的请求
  const reqTime = useRef(Date.now()) // 记录请求发出的时间
  const prevPullDownLoadingStatus = useRef(null) // 存储pullDown的前一次loading状态
  const prevPullUpLoadingStatus = useRef(null) // 存储pullUp的前一次loading状态

  const scrollRef = useRef() // 存储scroll的dom

  // 保存定时器id，并在组件卸载时统一clearTimeout
  const timerId1 = useRef()
  const timerId2 = useRef()
  const timerId3 = useRef()

  // loadingStatus传递页面初始加载时的加载状态，可以控制初始加载时tips的显示消失，跟pullDown和pullUp无关
  // 约定loadingStatus： 0：请求未完成； 1：请求完成；
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
    onTouchMoveFn,
    refreshThreshold = 70, // 下拉达到刷新的距离界限 70 (以375px屏幕为例)
    touchThreshold = 132, // 滑块最多滑动到的距离 132
    loadingStop = 70, // 下拉刷新 loading时，滑块停留的位置 70
    tipsStop = 50 // tips停留的位置 50
  } = props

  // 切换路由时页面可能需要缓存，此处可以还原滚动位置
  useEffect(() => {
    if (initialScrollTop) {
      scrollRef.current.scrollTo(0, initialScrollTop)
    }
    // eslint-disable-next-line
  }, [])

  // -------------------------------------------------------
  // 以下是获取scroll的container dom的两种方式

  // 方法一：通过调用回调函数
  useEffect(() => {
    getScrollElement && getScrollElement(scrollRef.current)
  }, [getScrollElement])

  // 方法二：通过React.forwardRef转发ref，并且使用useImperativeHandle
  // 注意：useImperativeHandle需要和React.forwardRef配合使用
  // 直接转发ref是将React.forwardRef中函数上的ref参数直接应用在了返回元素的ref属性上，其实父、子组件引用的是同一个ref的current对象
  // 而使用useImperativeHandle后，可以让父、子组件分别有自己的 ref，通过React.forwardRef将父组件的ref透传过来，通过useImperativeHandle方法来自定义开放给父组件的current
  // 通过useImperativeHandle将子组件的实例属性输出到父组件时，在子组件内部通过ref更改current对象后，组件不会重新渲染
  useImperativeHandle(
    ref,
    () => ({
      getScrollElement() {
        return scrollRef.current
      }
    }),
    []
  )

  // -------------------------------------------------------

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

  // 触摸开始
  useEventListener(
    'touchstart',
    e => {
      touchStart.current = e.touches[0].clientY
      // 下拉刷新
      if (!isRefreshing) {
        setIsTouchEnd(false)
      }
    },
    scrollRef
  )

  // 触摸进行中
  useEventListener(
    'touchmove',
    e => {
      onTouchMoveFn && onTouchMoveFn()

      // 注意，下拉刷新是需要向下触摸拖拽才触发的，而上拉加载是只要页面滑到底部就应该进行加载
      // 所以下拉刷新用touch事件，而上拉加载用scroll事件

      // 是否触顶
      isTop.current = scrollRef.current.scrollTop === 0

      // 取消浏览器的默认下拉行为，比如手机QQ浏览器，会显示"已启用QQ浏览器X5内核"字样，且与自定义下拉刷新操作冲突
      // 而要取消浏览器自身的下拉刷新操作，如手机chrome浏览器，只需要给body标签增加overflow: hidden;
      // 触顶，且有下拉动作，取消默认行为
      if (isTop.current && e.touches[0].clientY > touchStart.current) {
        // e.cancelable===false的时候无法取消touchmove事件，会报错
        e.cancelable && e.preventDefault()
      }

      // 下拉刷新
      if (pullDown.callback && isTop.current && !isRefreshing) {
        // 在isTop每次由false变为true的时候，都要设置一次touchStart，因为触摸的距离是大于滑块实际滑动的距离的
        // 用isStatePull这个状态来保证每次isTop切换成true的时候，只会设置一次touchStart
        if (!isStartPull.current) {
          touchStart.current = e.touches[0].clientY
          isStartPull.current = true
        } else {
          const diff = e.touches[0].clientY - touchStart.current
          if (diff <= 0) {
            setScrollLock(false) // 释放滚动区域
          } else if (0 < diff && diff < refreshThreshold) {
            setScrollLock(true) // 锁住滚动区域，避免touchmove的时候整体区域也跟着滚动
            // 没有拉到刷新的界限
            setSlideLength(diff) // 滑块实际滑动距离
            setIsRefreshReady(false) // isRefreshReady为false时，滑块opacity为0.5，释放后归位
          } else if (refreshThreshold <= diff && diff < touchThreshold) {
            setScrollLock(true) // 锁住滚动区域
            // 拉到可以刷新的界限，并且最多拉到TOUCH_THRESHOLD
            setSlideLength(diff) // 滑块实际滑动距离
            setIsRefreshReady(true) // isRefreshReady为true时，滑块opacity为1，释放后停留loading
          }
        }
      }
    },
    scrollRef
  )

  // 触摸结束
  useEventListener(
    'touchend',
    e => {
      // 下拉刷新
      if (pullDown.callback && !isRefreshing) {
        setScrollLock(false) // 释放滚动区域
        // 触摸结束时，isTouchEnd设置为true，也就是释放的时候才给滑块设置transition: transform 0.2s
        setIsTouchEnd(true)
        isStartPull.current = false
        if (!isRefreshReady) {
          // 没下拉到可以刷新的位置，触摸结束时，就把滑块归位，否则触发刷新流程
          setSlideLength(0)
        } else {
          // 下拉到已经可以刷新的位置，触摸结束时，就把滑块停留到loadingStop的位置，并且setIsRefreshing(true)
          setSlideLength(loadingStop)
          // isRefreshing:true -> 换成动态loading图标
          setIsRefreshing(true)
          // 设置网络请求发出的时间，因为如果请求返回的速度很快的话，loading图标一闪就没了，需要适当延长时间
          reqTime.current = Date.now()
          // 回调函数 进行刷新所需要的网络请求
          pullDown.callback()
        }
      }
    },
    scrollRef
  )

  // 下拉刷新
  // 网络请求完成后，需要进行的收尾工作
  const finishPullDown = useCallback(() => {
    // 加载完成后，loading图标复位。需要先把loading图标消除，再把slideLength置为0，否则会有归位的动画
    setShowLoadingIcon(false)
    setSlideLength(0)
    setShowLoadingIcon(true)
    // isRefreshReady:false -> opacity:0.5
    setIsRefreshReady(false)
    // isRefreshing:true -> 换成动态loading图标
    setIsRefreshing(false)
    // 适当调整tips出现的时机
    timerId1.current = setTimeout(() => {
      setShowRefreshTips(true)
    }, 700)
    timerId2.current = setTimeout(() => {
      setShowRefreshTips(false)
    }, 2000)
  }, [])

  // 需要监听loadingStatus，当网络请求进行完毕时，调用finishPullDown()
  // 但是，如果网络请求很快就完成了，loading图标就会一闪而过，这就需要适当延长loading图标显示的时间
  const delayFinishPullDown = useCallback(() => {
    const timeDiff = Date.now() - reqTime.current
    if (timeDiff < 1500) {
      timerId3.current = setTimeout(() => {
        finishPullDown()
      }, 1500 - timeDiff)
    } else {
      finishPullDown()
    }
    // eslint-disable-next-line
  }, [])

  // 初次加载，需要delayFinishPullDown()，以此来触发显示 "已为您推荐个性化内容" 的tips
  useEffect(() => {
    // loadingStatus 约定：  0：请求未完成； 1：请求完成；
    if (isFirstLoad.current && loadingStatus === 1) {
      isFirstLoad.current = false
      delayFinishPullDown()
    }
  }, [loadingStatus, delayFinishPullDown])

  // 下拉刷新，请求加载完成后，delayFinishPullDown()，触发显示 "已为您推荐个性化内容" 的tips
  useEffect(() => {
    // loadingStatus 约定：  0：请求未完成； 1：请求完成；
    if (
      pullDown.callback &&
      !isFirstLoad.current &&
      prevPullDownLoadingStatus.current === 0 &&
      pullDown.loadingStatus === 1
    ) {
      delayFinishPullDown()
    }
    prevPullDownLoadingStatus.current = pullDown.loadingStatus
  }, [pullDown.callback, pullDown.loadingStatus, delayFinishPullDown])

  // 滚动事件监听是否触底
  useEventListener(
    'scroll',
    e => {
      // 是否触底
      isBottom.current =
        scrollRef.current.scrollTop + scrollRef.current.offsetHeight + 5 >=
        scrollRef.current.scrollHeight

      // 上拉加载
      if (pullUp.callback && pullUp.hasMore && isBottom.current && !isLoading.current) {
        // 触底，没有正在进行加载请求，就进行上拉加载请求
        isLoading.current = true
        pullUp.callback()
      }
    },
    scrollRef
  )

  // 上拉加载
  useEffect(() => {
    if (isLoading.current && prevPullUpLoadingStatus.current === 0 && pullUp.loadingStatus === 1) {
      isLoading.current = false
    }
    prevPullUpLoadingStatus.current = pullUp.loadingStatus
  }, [pullUp.loadingStatus])

  // 组件卸载时，删除定时器
  useEffect(() => {
    return () => {
      clearTimeout(timerId1.current)
      clearTimeout(timerId2.current)
      clearTimeout(timerId3.current)
    }
  }, [])

  return (
    <div className="scroll" ref={scrollRef} style={{ overflow: scrollLock ? 'hidden' : 'auto' }}>
      {pullDown.callback && (
        <div className="pulldown-refresh">
          {showLoadingIcon && (
            <div
              className="icon-wrapper"
              style={{
                transform: `translateY(${slideLength}px)`,
                // 没有达到刷新距离，以及达到刷新距离，松手时isTouchEnd都为true
                transition: isTouchEnd && 'transform 0.2s'
              }}
            >
              {!isRefreshing ? (
                <>
                  <img
                    className="loading-in"
                    src={require('@/assets/svg-icons/refresh-loading-in.svg')}
                    style={{
                      transform: `rotate(${-slideLength}deg)`,
                      opacity: isRefreshReady ? 1 : 0.5
                    }}
                    alt=""
                  />
                  <img
                    className="loading-out"
                    src={require('@/assets/svg-icons/refresh-loading-out.svg')}
                    style={{
                      transform: `rotate(${slideLength}deg)`,
                      opacity: isRefreshReady ? 1 : 0.5
                    }}
                    alt=""
                  />
                </>
              ) : (
                <img src={require('@/assets/svg-icons/refresh-loading.svg')} alt="" />
              )}
            </div>
          )}
        </div>
      )}
      {loadingStatus !== undefined && (
        <div className="refresh-tips">
          <span
            style={{
              transform: showRefreshTips && `translateY(${tipsStop}PX)`
            }}
          >
            {tips}
          </span>
        </div>
      )}
      {children}
      {pullUp.callback && pullUp.hasMore && (
        <div className="pullup-load">
          <img src={require('@/assets/svg-icons/loading.svg')} alt="" />
          <span>努力加载中...</span>
        </div>
      )}
    </div>
  )
})

export default React.memo(Scroll)
