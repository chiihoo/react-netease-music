import React from 'react'
import classNames from 'classnames'
import './index.scss'

// 单行歌曲展示组件
// 因为要放到React-virtualized中，所以要 key,style
const SongItem = props => {
  const { children, itemKey, style, song, privilege } = props

  return (
    <div className="song-item" key={itemKey} style={style}>
      <div className="main">
        {children !== undefined && <div className="main-left">{children}</div>}
        <div className="main-right" style={{ paddingLeft: children === undefined && '4.533vw' }}>
          <p
            className={classNames('title', 'one-line-ellipsis', {
              // 下架
              'off-the-shelf': privilege < 0
            })}
          >
            {song.name}
            {song.alia.length > 0 && <span className="alias">（{song.alia[0]}）</span>}
          </p>
          <p className="info">
            {/* VIP */}
            {privilege.fee === 1 && <i className="iconfont icon-VIP"></i>}
            {/* 试听 */}
            {/1152|1028|1088|1092/.test(privilege.flag) && (
              <i className="iconfont icon-shiting"></i>
            )}
            {/* 独家 */}
            {/64|68|1088|1092/.test(privilege.flag) && <i className="iconfont icon-dujia"></i>}
            {/* SQ */}
            {privilege.maxbr === 999000 && <i className="iconfont icon-SQ"></i>}
            <span
              className={classNames('artist-album-name', 'one-line-ellipsis', {
                'off-the-shelf': privilege < 0
              })}
            >
              {song?.ar.reduce((total, artist, index, arr) => {
                return index !== arr.length - 1
                  ? total + artist.name + '/'
                  : total + artist.name + ' - '
              }, '')}
              {song.al.name}
            </span>
          </p>
        </div>
      </div>
      <div className="right">
        <i className="iconfont icon-mv1"></i>
        <i className="iconfont icon-more"></i>
      </div>
    </div>
  )
}

export default React.memo(SongItem)
