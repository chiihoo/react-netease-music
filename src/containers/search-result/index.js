import React, { useState, useRef, useEffect, useCallback } from 'react'
import Swiper from 'react-id-swiper'
import classNames from 'classnames'
import { useObserver, useLocalStore } from 'mobx-react-lite'
import { useParams } from 'react-router-dom'
import { runInAction } from 'mobx'
import { useStores } from '@/stores'
import Complex from './components/complex'
import Song from './components/song'
import PlayList from './components/play-list'
import Video from './components/video'
import Artist from './components/artist'
import Album from './components/album'
import DjRadio from './components/dj-radio'
import User from './components/user'
import './index.scss'

// 搜索结果
const SearchResult = props => {
  const { searchStore, playerStore } = useStores()

  const tabListRef = useRef([]) // tab标签的ref集合
  const swiperRef = useRef()
  const navListRef = useRef() // tab标签的父盒子，主要用于滚动

  // const [activeIndex, searchStore.changeActiveIndex] = useState(0) // 当前选中tabs的index
  const [inkBarStyle, setInkBarStyle] = useState({ left: 0, width: 0 }) // tabs-ink-bar，即下方的红色长条的位置和大小

  const isFirstLoad = useRef(true)
  const shouldTransition = useRef(true)
  const [shouldInkTransition, setShouldInkTransition] = useState(true)

  const { keyword } = useParams()

  // 传进去nickname，即store.columns里面每个对象的nickname，比如传入'song'，则调用相对应的fetchData方法
  const fetchMore = useCallback(nickname => {
    for (let item of store.columns) {
      if (item.nickname === nickname) {
        runInAction(() => {
          item.currentOffset++
          item.fetchData(keyword)
        })
        break
      }
    }
    // eslint-disable-next-line
  }, [])

  // 上面这个方法不能直接写在store.columns的对象里面，因为
  // fetchMore() {
  //   this.currentOffset++
  //   this.fetchData()
  // }
  // <Song fetchMore={() => this.fetchMore()} />
  // 这个传进去的函数没有办法useCallback，会导致重渲染

  // 这里用mobx的useLocalStore，好修改点
  const store = useLocalStore(() => ({
    columns: [
      {
        name: '综合',
        nickname: 'complex',
        hasLoaded: false, // 每次在这个页面，每个栏目只加载一次
        currentOffset: 0, // 当前分页
        fetchData(keyword, offset = this.currentOffset, limit = 30) {
          runInAction(() => {
            this.loadingStatus = 0
          })
          return searchStore.getComplex(keyword, offset, limit).then(res => {
            runInAction(() => {
              this.loadingStatus = 1
            })
          })
        },
        component() {
          return (
            <Complex
              song={searchStore.complex.song}
              album={searchStore.complex.album}
              artist={searchStore.complex.artist}
              video={searchStore.complex.video}
              playList={searchStore.complex.playList}
              user={searchStore.complex.user}
              keyword={keyword}
              handleComplexSongItemClick={handleComplexSongItemClick}
              loadingStatus={this.loadingStatus}
              hasLoaded={this.hasLoaded}
              changeActiveIndexByNickname={changeActiveIndexByNickname}
            />
          )
        }
      },
      {
        name: '单曲',
        nickname: 'song',
        hasLoaded: false, // 第一次是否加载了
        loadingStatus: 0, // 加载更多时的状态
        currentOffset: 0, // 当前分页
        fetchData(keyword, offset = this.currentOffset, limit = 30) {
          // 这里必须得传这个keyword参数，如果不传参，直接在函数中用keyword的话，keyword改变时，函数内部没办法感知到它的变化
          runInAction(() => {
            this.loadingStatus = 0
          })
          if (this.currentOffset === 0) {
            return searchStore.getSong(keyword, offset, limit)
          } else {
            return searchStore.getSong(keyword, offset, limit).then(res => {
              runInAction(() => {
                this.loadingStatus = 1
              })
            })
          }
        },
        // 这里也必须得手动传keyword，否则无法感知它的变化
        component(keyword) {
          return (
            <Song
              songs={searchStore.song.songs}
              privileges={searchStore.song.privileges}
              handleSongItemClick={handleSongItemClick}
              handlePlayAllClick={handlePlayAllClick}
              fetchMore={fetchMore}
              loadingStatus={this.loadingStatus}
              hasLoaded={this.hasLoaded}
              hasMore={searchStore.song.hasMore}
              keyword={keyword}
            />
          )
        }
      },
      {
        name: '歌单',
        nickname: 'playList',
        hasLoaded: false, // 第一次是否加载了
        loadingStatus: 0, // 加载更多时的状态
        currentOffset: 0, // 当前分页
        fetchData(keyword, offset = this.currentOffset, limit = 30) {
          // 这里必须得传这个keyword参数，如果不传参，直接在函数中用keyword的话，keyword改变时，函数内部没办法感知到它的变化
          runInAction(() => {
            this.loadingStatus = 0
          })
          if (this.currentOffset === 0) {
            return searchStore.getPlayList(keyword, offset, limit)
          } else {
            return searchStore.getPlayList(keyword, offset, limit).then(res => {
              runInAction(() => {
                this.loadingStatus = 1
              })
            })
          }
        },
        component() {
          return (
            <PlayList
              playlists={searchStore.playList.playlists}
              fetchMore={fetchMore}
              loadingStatus={this.loadingStatus}
              hasLoaded={this.hasLoaded}
              hasMore={searchStore.playList.hasMore}
              keyword={keyword}
            />
          )
        }
      },
      {
        name: '视频',
        nickname: 'video',
        hasLoaded: false, // 第一次是否加载了
        loadingStatus: 0, // 加载更多时的状态
        currentOffset: 0, // 当前分页
        fetchData(keyword, offset = this.currentOffset, limit = 30) {
          runInAction(() => {
            this.loadingStatus = 0
          })
          if (this.currentOffset === 0) {
            return searchStore.getVideo(keyword, offset, limit)
          } else {
            return searchStore.getVideo(keyword, offset, limit).then(res => {
              runInAction(() => {
                this.loadingStatus = 1
              })
            })
          }
        },
        component(keyword) {
          return (
            <Video
              mvs={searchStore.video.mvs}
              hasMore={searchStore.video.mvCount > (this.currentOffset + 1) * 30}
              keyword={keyword}
              hasLoaded={this.hasLoaded}
              fetchMore={fetchMore}
              loadingStatus={this.loadingStatus}
            />
          )
        }
      },
      {
        name: '歌手',
        nickname: 'artist',
        hasLoaded: false, // 第一次是否加载了
        loadingStatus: 0, // 加载更多时的状态
        currentOffset: 0, // 当前分页
        fetchData(keyword, offset = this.currentOffset, limit = 30) {
          runInAction(() => {
            this.loadingStatus = 0
          })
          if (this.currentOffset === 0) {
            return searchStore.getArtist(keyword, offset, limit)
          } else {
            return searchStore.getArtist(keyword, offset, limit).then(res => {
              runInAction(() => {
                this.loadingStatus = 1
              })
            })
          }
        },
        component() {
          return (
            <Artist
              artists={searchStore.artist.artists}
              hasMore={searchStore.artist.hasMore}
              keyword={keyword}
              hasLoaded={this.hasLoaded}
              fetchMore={fetchMore}
              loadingStatus={this.loadingStatus}
            />
          )
        }
      },
      {
        name: '专辑',
        nickname: 'album',
        hasLoaded: false, // 第一次是否加载了
        loadingStatus: 0, // 加载更多时的状态
        currentOffset: 0, // 当前分页
        fetchData(keyword, offset = this.currentOffset, limit = 30) {
          runInAction(() => {
            this.loadingStatus = 0
          })
          if (this.currentOffset === 0) {
            return searchStore.getAlbum(keyword, offset, limit)
          } else {
            return searchStore.getAlbum(keyword, offset, limit).then(res => {
              runInAction(() => {
                this.loadingStatus = 1
              })
            })
          }
        },
        component() {
          return (
            <Album
              albums={searchStore.album.albums}
              hasMore={searchStore.album.albumCount > (this.currentOffset + 1) * 30}
              keyword={keyword}
              hasLoaded={this.hasLoaded}
              fetchMore={fetchMore}
              loadingStatus={this.loadingStatus}
            />
          )
        }
      },

      {
        name: '主播电台',
        nickname: 'djRadio',
        hasLoaded: false, // 第一次是否加载了
        loadingStatus: 0, // 加载更多时的状态
        currentOffset: 0, // 当前分页
        fetchData(keyword, offset = this.currentOffset, limit = 30) {
          runInAction(() => {
            this.loadingStatus = 0
          })
          if (this.currentOffset === 0) {
            return searchStore.getDjRadio(keyword, offset, limit)
          } else {
            return searchStore.getDjRadio(keyword, offset, limit).then(res => {
              runInAction(() => {
                this.loadingStatus = 1
              })
            })
          }
        },
        component() {
          return (
            <DjRadio
              djRadios={searchStore.djRadio.djRadios}
              hasMore={searchStore.djRadio.djRadiosCount > (this.currentOffset + 1) * 30}
              keyword={keyword}
              hasLoaded={this.hasLoaded}
              fetchMore={fetchMore}
              loadingStatus={this.loadingStatus}
            />
          )
        }
      },
      {
        name: '用户',
        nickname: 'user',
        hasLoaded: false, // 第一次是否加载了
        loadingStatus: 0, // 加载更多时的状态
        currentOffset: 0, // 当前分页
        fetchData(keyword, offset = this.currentOffset, limit = 30) {
          runInAction(() => {
            this.loadingStatus = 0
          })
          if (this.currentOffset === 0) {
            return searchStore.getUser(keyword, offset, limit)
          } else {
            return searchStore.getUser(keyword, offset, limit).then(res => {
              runInAction(() => {
                this.loadingStatus = 1
              })
            })
          }
        },
        component() {
          return (
            <User
              users={searchStore.user.userprofiles}
              hasMore={searchStore.user.hasMore}
              keyword={keyword}
              hasLoaded={this.hasLoaded}
              fetchMore={fetchMore}
              loadingStatus={this.loadingStatus}
            />
          )
        }
      }
    ]
  }))

  // 当搜索词汇变化的时候，要重置所有栏目的hasLoaded为false
  useEffect(() => {
    searchStore.resetSearchResult()
    runInAction(() => {
      store.columns.forEach(item => (item.hasLoaded = false))
    })
    // eslint-disable-next-line
  }, [keyword])

  // 当第一次点击某个栏目时，加载数据，并把对应hasLoaded置为true
  // 当搜索词汇变化时，因为上面将所有栏目的hasLoaded都重置为了false，所以符合条件，会进行重新加载数据
  useEffect(() => {
    if (store.columns[searchStore.activeIndex].hasLoaded === false) {
      // 这里的fetchData即为对应栏目请求数据的方法，默认为请求30条数据，分页为第一页0
      store.columns[searchStore.activeIndex].fetchData(keyword, 0, 30).then(res => {
        // 请求完毕后将对应hasLoaded置为true
        runInAction(() => {
          store.columns[searchStore.activeIndex].hasLoaded = true
        })
      })
    }
    // eslint-disable-next-line
  }, [searchStore.activeIndex, keyword])

  // 需要设置初始tab标签的位置和大小
  useEffect(() => {
    setInkBarStyle({
      left: tabListRef.current[0].offsetLeft,
      width: tabListRef.current[0].offsetWidth
    })
  }, [])

  // react-id-swiper的传入参数
  const swiperParams = {
    resistanceRatio: 0,
    speed: 200,
    on: {
      // swiper切换页面时，设置当前活动页activeIndex
      slideChange: function () {
        searchStore.changeActiveIndex(this.activeIndex)
      }
    }
  }

  // 每次切换activeIndex时，都要把当前活动的tabs移动到父级盒子中间，并且设置当前ink-bar的位置，以及跳转swiper到activeIndex所代表的页面
  useEffect(() => {
    // 要使active的那个tab移动到父级盒子中间，需要用这个tab距离父级左侧边界的距离 + 自身的一半 - 盒子的一半宽度（不是overflow的实际宽度），计算结果即为要移动到的距离
    let toLeft =
      tabListRef.current[searchStore.activeIndex].offsetLeft +
      tabListRef.current[searchStore.activeIndex].offsetWidth / 2 -
      navListRef.current.offsetWidth / 2
    navListRef.current.scrollTo({
      left: toLeft,
      behavior: 'smooth'
    })

    // 只要activeIndex改变，就设置当前ink-bar的位置
    setInkBarStyle({
      left: tabListRef.current[searchStore.activeIndex].offsetLeft,
      width: tabListRef.current[searchStore.activeIndex].offsetWidth
    })
    // 跳转swiper到activeIndex所代表的页面
    // 是否需要过渡动画
    // 第一次进入页面时到达上一次的标签页（包括从下一级页面返回时），都不需要过渡动画
    // 只有已经进入页面之后才需要过渡动画
    if (isFirstLoad.current) {
      swiperRef.current.swiper.slideTo(searchStore.activeIndex, 0, false)
      setShouldInkTransition(false)
      isFirstLoad.current = false
    } else {
      if (shouldTransition.current) {
        setShouldInkTransition(true)
        swiperRef.current.swiper.slideTo(searchStore.activeIndex)
      } else {
        setShouldInkTransition(false)
        swiperRef.current.swiper.slideTo(searchStore.activeIndex, 0, false)
      }
    }
    shouldTransition.current = true
  }, [searchStore.activeIndex])

  // 通过nickname来变换activeIndex，主要用于综合页面的"查看全部XX首单曲"类似这种的按钮跳转，并且不能有平滑滚动
  const changeActiveIndexByNickname = useCallback(nickname => {
    for (let i = 0; i < store.columns.length; i++) {
      if (store.columns[i].nickname === nickname) {
        shouldTransition.current = false
        searchStore.changeActiveIndex(i)
        break
      }
    }
    // eslint-disable-next-line
  }, [])

  // 点击综合栏目 单行歌曲项，进行播放
  const handleComplexSongItemClick = useCallback((songId, isVIPSong) => {
    playerStore.addSongToPlay(
      songId,
      searchStore.complex.song.songs,
      searchStore.complex.song.privileges
    )
    // eslint-disable-next-line
  }, [])

  // 点击单行歌曲项，进行播放
  const handleSongItemClick = useCallback((songId, isVIPSong) => {
    playerStore.addSongToPlay(songId, searchStore.song.songs, searchStore.song.privileges)
    // eslint-disable-next-line
  }, [])

  // 点击播放全部
  const handlePlayAllClick = useCallback(() => {
    playerStore.playAll(searchStore.song.songs, searchStore.song.privileges)
    // eslint-disable-next-line
  }, [])

  return useObserver(() => (
    <div className="search-result">
      {/* tabs标签 */}
      <div className="tabs-nav-wrapper">
        {/* tabs-nav-list是水平滚动盒子 */}
        <div className="tabs-nav-list" ref={navListRef}>
          {store.columns.map((item, index) => (
            <div
              key={item.nickname}
              className="tabs-tab-wrapper"
              onClick={() => searchStore.changeActiveIndex(index)}
            >
              <div
                className={classNames('tabs-tab', {
                  'tabs-tab-active': searchStore.activeIndex === index
                })}
                ref={ref => {
                  tabListRef.current[index] = ref
                }}
              >
                {item.name}
              </div>
            </div>
          ))}
          <div
            className={classNames('tabs-ink-bar', { 'tabs-ink-bar-animated': shouldInkTransition })}
            style={{ left: inkBarStyle.left, width: inkBarStyle.width }}
          ></div>
        </div>
      </div>
      {/* tabs标签的具体内容 */}
      <div className="tabs-content">
        <Swiper {...swiperParams} ref={swiperRef}>
          {store.columns.map(item => {
            return <div key={item.nickname}>{item.component(keyword)}</div>
          })}
        </Swiper>
      </div>
    </div>
  ))
}

export default React.memo(SearchResult)
