import React, { useMemo } from 'react'
import classNames from 'classnames'
import './index.scss'

// 单行歌曲展示组件
// 因为要放到React-virtualized中，所以要 key（直接挂在组件上），style（挂在组件内的外层标签上）
const SongItem = props => {
  const { style, song, privilege, handleSongItemClick, keyword } = props

  const artists = useMemo(
    () =>
      song?.ar?.reduce((total, artist, index, arr) => {
        return index !== arr.length - 1 ? total + artist.name + '/' : total + artist.name + ' - '
      }, ''),
    [song.ar]
  )

  // 这种方式可以把keyword这个变量的值写到正则里面去
  const regex = new RegExp(keyword, 'gi')

  return (
    <div className="search-result-song-item" style={style}>
      <div className="main" onClick={() => handleSongItemClick(song.id, privilege.fee === 1)}>
        <p
          className={classNames('title', 'one-line-ellipsis', {
            // 下架
            'off-the-shelf': privilege.st === -200
          })}
        >
          {/* 将匹配到的关键字高亮显示 */}
          {/* {song.name} */}
          <span
            dangerouslySetInnerHTML={{
              // 第二个参数写成函数就可以拿到匹配到的原值了
              __html: song.name.replace(regex, x => `<span class="keyword-highlight">${x}</span>`)
            }}
          ></span>
          {/* {song.alia.length > 0 && <span className="alias">（{song.alia[0]}）</span>} */}
          {song.alia.length > 0 && (
            <span className="alias">
              （
              <span
                dangerouslySetInnerHTML={{
                  __html: song.alia[0].replace(
                    regex,
                    x => `<span class="keyword-highlight">${x}</span>`
                  )
                }}
              ></span>
              ）
            </span>
          )}
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
            {/* {artists} */}
            <span
              dangerouslySetInnerHTML={{
                __html: artists.replace(regex, x => `<span class="keyword-highlight">${x}</span>`)
              }}
            ></span>
            {/* {song.al.name} */}
            <span
              dangerouslySetInnerHTML={{
                __html: song.al.name.replace(
                  regex,
                  x => `<span class="keyword-highlight">${x}</span>`
                )
              }}
            ></span>
          </span>
        </p>
      </div>
      <div className="right">
        {song.mv !== 0 && <i className="iconfont icon-mv1"></i>}
        <i className="iconfont icon-more"></i>
      </div>
    </div>
  )
}

export default React.memo(SongItem)
