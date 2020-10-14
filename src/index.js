import React from 'react'
import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import { BrowserRouter } from 'react-router-dom'
import { storesContext, stores } from '@/stores'
import App from './App'
import './index.css'
import 'swiper/css/swiper.css'
import 'react-virtualized/styles.css'

ReactDOM.render(
  <storesContext.Provider value={stores}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </storesContext.Provider>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
