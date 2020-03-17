import React from 'react'
import { Redirect } from 'react-router-dom'
import Home from '../containers/Home'
import Find from '../containers/Find'

const routes = [
  { path: '/', exact: true, render: () => <Redirect to="/home" /> },
  {
    path: '/home',
    component: Home,
    routes: [
      {
        path: '/home',
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
      },
      {
        path: '*',
        render: () => <Redirect to="/home" />
      }
    ]
  },
  {
    path: '/search',
    component: () => <>search</>
  },
  {
    path: '*',
    render: () => <Redirect to="/home" />
  }
]

export default routes
