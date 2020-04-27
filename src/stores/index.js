import React from 'react'
import { configure } from 'mobx'
import { FindStore } from './FindStore'

configure({ enforceActions: 'always' })

export const stores = { FindStore }

export const storesContext = React.createContext()

export const useStores = () => React.useContext(storesContext)
