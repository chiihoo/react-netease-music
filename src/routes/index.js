import React from 'react'
import { Redirect } from 'react-router-dom'
import Home from '../containers/Home'
import Find from '../containers/Find'

const routes = [
  { path: '/', exact: true, render: () => <Redirect to="/home/find" /> },
  {
    path: '/home',
    component: Home,
    routes: [
      {
        path: '/home/find',
        exact: true,
        component: () => <Find />
      },
      {
        path: '/home/my',
        exact: true,
        component: () => <>my</>
      },
      {
        path: '/home/yuncun',
        exact: true,
        component: () => <>yuncun</>
      }
      // {
      //   path: '*',
      //   render: () => <Redirect to="/home/find" />
      // }
    ]
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
    component: () => <>歌单</>
  },
  {
    path: '/toplist',
    component: () => <>排行榜</>
  },
  {
    path: '/radio',
    component: () => <>电台</>
  }
  // {
  //   path: '*',
  //   render: () => <Redirect to="/home/find" />
  // }
]

export default routes
