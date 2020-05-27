import React from 'react'
import { Redirect } from 'react-router-dom'
import KeepAlive from 'react-activation'
import Home from '../containers/Home'
import Playlist from '../containers/Playlist'

const routes = [
  { path: '/', exact: true, render: () => <Redirect to="/home" /> },
  {
    path: '/home',
    render: props => (
      <KeepAlive>
        <Home {...props} />
      </KeepAlive>
    )
  },
  {
    path: '/play',
    component: () => <>播放页面</>
  },
  {
    path: '/search',
    component: () => <>搜索</>
  },
  {
    path: '/recommend/taste', //日推
    component: () => <>日推</>
  },
  {
    path: '/playlist/subscribers',
    component: () => <>歌单订阅者</>
  },
  {
    path: '/playlist/recommend',
    component: () => <>歌单广场</>
  },
  {
    // 歌单详情页
    path: '/playlist/:id',
    component: Playlist
  },
  {
    path: '/user/:uid',
    component: () => <>用户信息</>
  },
  {
    path: '/toplist',
    component: () => <>排行榜</>
  },
  {
    path: '/radio',
    component: () => <>电台</>
  },
  {
    path: '/hotwall',
    component: () => <>云村热评墙</>
  }

  // {
  //   path: '*',
  //   render: () => <Redirect to="/home/find" />
  // }
]

export default routes
