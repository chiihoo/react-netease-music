import React from 'react'
import { Redirect } from 'react-router-dom'
import Home from '../containers/Home'

const routes = [
  { path: '/', exact: true, render: () => <Redirect to="/home" /> },
  {
    path: '/home',
    component: Home
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
    path: '/playlist',
    component: () => <>歌单广场</>
  },
  {
    path: '/playlist/:id',
    component: () => <>歌单详情页</>
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
