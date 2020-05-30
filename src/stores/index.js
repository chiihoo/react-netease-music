import React from 'react'
import { configure } from 'mobx'
import { FindStore } from './FindStore'
import { YuncunStore } from './YuncunStore'
import { PlaylistStore } from './PlaylistStore'

configure({ enforceActions: 'always' })

export const stores = { FindStore, YuncunStore, PlaylistStore }

export const storesContext = React.createContext()

export const useStores = () => React.useContext(storesContext)
