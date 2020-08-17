import React from 'react'
import './index.scss'

// 确认对话框
const Dialog = props => {
  const { children, visible, onCancle } = props

  return (
    <div className="dialog">
      <div
        className="dialog-mask"
        onClick={() => onCancle()}
        style={{ display: visible ? 'block' : 'none' }}
      ></div>
      <div
        className="dialog-content"
        style={{
          display: visible ? 'block' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default React.memo(Dialog)
