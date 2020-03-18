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
      },
      {
        path: '*',
        render: () => <Redirect to="/home/find" />
      }
    ]
  },
  {
    path: '/search',
    component: () => <>search</>
  },
  {
    path: '*',
    render: () => <Redirect to="/home/find" />
  }
]

export default routes
