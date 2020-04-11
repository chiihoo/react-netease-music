import produce from 'immer'
import {
  getBannerRequest,
  getHotwallRequest,
  getRecommendPlaylistsRequest,
  getNewSongsRequest,
  getNewAlbumsRequest
} from '../../api'

export const actionTypes = {
  CHANGE_BANNER_LIST: '/home/find/changeBannerList',
  CHANGE_HOTWALL_LIST: '/home/find/changeHotwallList',
  CHANGE_RECOMMENDPLAYLISTS: '/home/find/changeRecommendPlaylists',
  CHANGE_SCENERECOMMENDPLAYLISTS: '/home/find/changeSceneRecommendPlaylists',
  CHANGE_NEWSONGS: '/home/find/changeNewSongs',
  CHANGE_NEWALBUMS: '/home/find/changeNewAlbums'
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
  fetchRecommendPlaylists() {
    return dispatch => {
      getRecommendPlaylistsRequest(6, '全部').then(data => {
        dispatch({ type: actionTypes.CHANGE_RECOMMENDPLAYLISTS, data })
      })
    }
  },
  fetchSceneRecommendPlaylists() {
    return dispatch => {
      getRecommendPlaylistsRequest(6, '官方').then(data => {
        dispatch({ type: actionTypes.CHANGE_SCENERECOMMENDPLAYLISTS, data })
      })
    }
  },
  fetchNewSongs() {
    return dispatch => {
      getNewSongsRequest().then(data => {
        dispatch({ type: actionTypes.CHANGE_NEWSONGS, data })
      })
    }
  },
  fetchNewAlbums() {
    return dispatch => {
      getNewAlbumsRequest().then(data => {
        dispatch({ type: actionTypes.CHANGE_NEWALBUMS, data })
      })
    }
  }
}

export const initState = {
  bannerList: [],
  hotwallList: [],
  recommendPlaylists: [],
  sceneRecommendPlaylists: [],
  newSongs: [],
  newAlbums: []
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
    case actionTypes.CHANGE_SCENERECOMMENDPLAYLISTS:
      return produce(state, state => {
        state.sceneRecommendPlaylists = action.data.playlists
      })
    case actionTypes.CHANGE_NEWSONGS:
      return produce(state, state => {
        state.newSongs = action.data.result
      })
    case actionTypes.CHANGE_NEWALBUMS:
      return produce(state, state => {
        state.newAlbums = action.data.albums
      })
    default:
      return state
  }
}
