import React from 'react'
import './index.scss'

// 给内层函数添加loading图标以及未找到内容的notice
const WithNotice = props => {
  const { children, hasLoaded, notFind, keyword } = props
  return (
    <div className="with-notice">
      {hasLoaded === false ? (
        <div className="loading">
          <img src={require('@/assets/svg-icons/loading.svg')} alt="" />
          <span>努力加载中...</span>
        </div>
      ) : notFind === true ? (
        <div className="not-find-notice">未找到与“{keyword}”相关的内容</div>
      ) : (
        children
      )}
    </div>
  )
}

export default React.memo(WithNotice)
