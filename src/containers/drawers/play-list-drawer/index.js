import React, { useCallback, useRef, useEffect } from 'react'
import { useObserver, Observer } from 'mobx-react-lite'
import { List, AutoSizer } from 'react-virtualized'
import { useStores } from '@/stores'
import Drawer from '@/components/drawer'
import './index.scss'

// player和mini-player的当前播放列表，点击右下角的菜单键触发
const PlayListDrawer = () => {
  const { playerStore, triggerStore } = useStores()

  const listRef = useRef()

  const onClose = useCallback(() => {
    triggerStore.changeShowPlayListDrawer(false)
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (triggerStore.showPlayListDrawer) {
      // 每次打开播放列表时，自动滚动到正在播放的歌曲那里，默认是视野内第一行，这里-2就会再往下挪两行，乘的是每行高度
      listRef.current.scrollToPosition((playerStore.playListIndex - 2) * window.innerWidth * 0.12)
      // 底下这个也可以滚动到特定行，但效果不同，如果目标行在视野内，则位置不变
      // 如果目标行在区域上方，不在视野内，则会挪到视野内第一行
      // 如果目标行在区域下方，不在视野内，则会挪到视野内最后一行
      // listRef.current.scrollToRow(playerStore.playListIndex)
    }
    // eslint-disable-next-line
  }, [triggerStore.showPlayListDrawer])

  // 这里用observer（针对组件）和useObserver都不行，只有用Observer才有效的观察到了color的更新
  // https://mobx-react.js.org/observer-component
  const rowRenderer = ({ key, index, style }) => {
    const song = playerStore.playList[index]
    return (
      <div className="song-row" key={key} style={style}>
        <Observer>
          {() => (
            <p
              className="one-line-ellipsis"
              style={{
                color: playerStore.currentSongId === song?.id && '#fe3a3b'
              }}
              onClick={() => playerStore.changeCurrentPlaySong(song?.id)}
            >
              {playerStore.currentSongId === song?.id && <i className="iconfont icon-laba"></i>}
              {playerStore.privileges[index].fee === 1 && <i className="iconfont icon-VIP"></i>}
              <span className="name">{song?.name}</span>
              <span className="artists">
                {song?.ar.reduce((total, artist, index, arr) => {
                  return index !== arr.length - 1 ? total + artist.name + '/' : total + artist.name
                }, '-')}
              </span>
            </p>
          )}
        </Observer>
        <i className="iconfont icon-quxiao" onClick={() => playerStore.deleteSong(song?.id)}></i>
      </div>
    )
  }

  return useObserver(() => (
    <Drawer placement="bottom" visible={triggerStore.showPlayListDrawer} onClose={onClose}>
      <div className="play-list-drawer">
        <div className="content">
          <h4>
            当前播放<span>({playerStore.playList.length})</span>
          </h4>
          <div className="controller">
            <div className="play-mode">
              {playerStore.playMode === 'list' && (
                <div
                  onClick={() => {
                    playerStore.changePlayMode('random')
                  }}
                >
                  <i className="iconfont icon-xunhuanbofang"></i>
                  <span>列表循环</span>
                </div>
              )}
              {playerStore.playMode === 'random' && (
                <div onClick={() => playerStore.changePlayMode('single')}>
                  <i className="iconfont icon-suijibofang"></i>
                  <span>随机播放</span>
                </div>
              )}
              {playerStore.playMode === 'single' && (
                <div onClick={() => playerStore.changePlayMode('list')}>
                  <i className="iconfont icon-danquxunhuan"></i>
                  <span>单曲循环</span>
                </div>
              )}
            </div>
            <i
              className="iconfont icon-delete"
              onClick={() => triggerStore.changeShowDeleteAllDialog(true)}
            ></i>
          </div>
          <div className="virtualized-wrapper">
            <AutoSizer>
              {({ height, width }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={playerStore.playList.length}
                  rowHeight={window.innerWidth * 0.12}
                  rowRenderer={rowRenderer}
                  ref={listRef}
                />
              )}
            </AutoSizer>
          </div>
        </div>
      </div>
    </Drawer>
  ))
}

export default React.memo(PlayListDrawer)
