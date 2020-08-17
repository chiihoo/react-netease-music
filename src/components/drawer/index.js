import React, { useMemo } from 'react'
import classNames from 'classnames'
import './index.scss'

// 屏幕边缘滑出的浮层面板
const Drawer = props => {
  const {
    children,
    placement = 'left', // 'top', 'right', 'bottom', 'left'
    visible,
    onClose,
    duration = 200
  } = props

  let translatePos = useMemo(() => {
    switch (placement) {
      case 'top':
        return 'translate(0, -100%)'
      case 'bottom':
        return 'translate(0, 100%)'
      case 'left':
        return 'translate(-100%, 0)'
      case 'right':
        return 'translate(100%, 0)'
      default:
        return ''
    }
  }, [placement])

  return (
    <div className="drawer">
      <div
        className="drawer-mask"
        onClick={() => onClose()}
        style={{ display: visible ? 'block' : 'none' }}
      ></div>
      <div
        className={classNames('drawer-content', { [`drawer-${placement}`]: true })}
        style={{
          transition: `transform ${duration}ms`,
          transform: visible ? 'translate(0, 0)' : translatePos
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default React.memo(Drawer)
