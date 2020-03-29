import produce from 'immer'
import { getBannerRequest, getHotwallRequest, getRecommendPlaylists } from '../../api'

export const actionTypes = {
  CHANGE_BANNER_LIST: '/home/find/changeBannerList',
  CHANGE_HOTWALL_LIST: '/home/find/changeHotwallList',
  CHANGE_RECOMMENDPLAYLISTS: '/home/find/changeRecommendPlaylists'
}

export const actions = {
  fetchBannerList() {
    return dispatch => {
      getBannerRequest().then(data => {
        dispatch({ type: actionTypes.CHANGE_BANNER_LIST, data })
      })
    }
  },
  fetchHotwallList() {
    return dispatch => {
      getHotwallRequest().then(data => {
        dispatch({ type: actionTypes.CHANGE_HOTWALL_LIST, data })
      })
    }
  },
  fetchRecommendPlaylist(...params) {
    return dispatch => {
      getRecommendPlaylists(...params).then(data => {
        dispatch({ type: actionTypes.CHANGE_RECOMMENDPLAYLISTS, data })
      })
    }
  }
}

export const initState = {
  bannerList: [],
  hotwallList: [],
  recommendPlaylists: []
}

export const FindReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_BANNER_LIST:
      return produce(state, state => {
        state.bannerList = action.data.banners
      })
    case actionTypes.CHANGE_HOTWALL_LIST:
      return produce(state, state => {
        state.hotwallList = action.data.data
      })
    case actionTypes.CHANGE_RECOMMENDPLAYLISTS:
      return produce(state, state => {
        state.recommendPlaylists = action.data.playlists
      })
    default:
      return state
  }
}
