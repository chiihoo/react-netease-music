import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { storesContext, stores } from '@/stores'
import App from './App'
import './index.css'
import 'swiper/css/swiper.css'

ReactDOM.render(
  <storesContext.Provider value={stores}>
    <App />
  </storesContext.Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
