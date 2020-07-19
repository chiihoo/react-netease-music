import React from 'react'
import { configure } from 'mobx'
import { findStore } from './findStore'
import { yuncunStore } from './yuncunStore'
import { playlistStore } from './playlistStore'
import { playerStore } from './playerStore'

configure({ enforceActions: 'always' })

export const stores = {
  findStore: new findStore(),
  yuncunStore: new yuncunStore(),
  playlistStore: new playlistStore(),
  playerStore: new playerStore()
}

export const storesContext = React.createContext()

export const useStores = () => React.useContext(storesContext)
