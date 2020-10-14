import React from 'react'
import classNames from 'classnames'
import './index.scss'

// 单行歌曲展示组件
// 因为要放到React-virtualized中，所以要 key（直接挂在组件上），style（挂在组件内的外层标签上）
const SongItem = props => {
  const { children, style, song, privilege, handleSongItemClick } = props
  // 有children的时候表示左侧需要留有空间，放置数字标号或者喇叭图标

  return (
    <div className="playlist-song-item" style={style}>
      <div className="main" onClick={() => handleSongItemClick(song.id, privilege.fee === 1)}>
        {children && <div className="main-left">{children}</div>}
        <div className="main-right" style={{ paddingLeft: !children && '4.533vw' }}>
          <p className={'title one-line-ellipsis'}>
            {song.name}
            {song.alia.length > 0 && <span className="alias">（{song.alia[0]}）</span>}
          </p>
          <p className="info">
            {/* VIP */}
            {privilege.fee === 1 && <i className="iconfont icon-VIP"></i>}
            {/* 试听 */}
            {/1152|1028|1088|1092|1284/.test(privilege.flag) && (
              <i className="iconfont icon-shiting"></i>
            )}
            {/* 独家 */}
            {/64|68|1088|1092/.test(privilege.flag) && <i className="iconfont icon-dujia"></i>}
            {/* SQ */}
            {privilege.maxbr === 999000 && <i className="iconfont icon-SQ"></i>}
            <span
              className={classNames('artist-album-name', 'one-line-ellipsis', {
                'off-the-shelf': privilege.st === -200
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
        {song.mv !== 0 && <i className="iconfont icon-mv1"></i>}
        <i className="iconfont icon-more"></i>
      </div>
    </div>
  )
}

export default React.memo(SongItem)
