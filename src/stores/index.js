import React from 'react'
import { configure } from 'mobx'
import { FindStore } from './FindStore'
import { PlaylistStore } from './PlaylistStore'

configure({ enforceActions: 'always' })

export const stores = { FindStore, PlaylistStore }

export const storesContext = React.createContext()

export const useStores = () => React.useContext(storesContext)
