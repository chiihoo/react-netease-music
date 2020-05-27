import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import { AliveScope } from 'react-activation'
import routes from './routes'
import './App.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AliveScope>{renderRoutes(routes)}</AliveScope>
      </BrowserRouter>
    </div>
  )
}

export default App
