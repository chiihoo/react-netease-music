import React from 'react'
import { BrowserRouter} from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import routes from './routes'
import './App.css'

function App() {
  return (
    <div className="App">
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </div>
  )
}

export default App
