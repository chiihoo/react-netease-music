import produce from 'immer'
import { getBannerRequest, getHotwallRequest } from '../../api'

export const actionTypes = {
  CHANGE_BANNER_LIST: '/home/find/changeBannerList',
  CHANGE_HOTWALL_LIST: '/home/find/changeHotwallList'
}

export const actions = {
  changeBannerList(data) {
    return { type: actionTypes.CHANGE_BANNER_LIST, data }
  },
  changeHotwallList(data) {
    return { type: actionTypes.CHANGE_HOTWALL_LIST, data }
  },
  // 在对象上定义方法不要用箭头函数，因为这样this不会指向该对象
  // fetchBannerList: () => dispatch => {
  //   getBannerRequest().then(data => {
  //     dispatch(actions.changeBannerList(data))
  //   })
  // }
  fetchBannerList() {
    return dispatch => {
      getBannerRequest().then(data => {
        dispatch(this.changeBannerList(data))
      })
    }
  },
  fetchHotwallList() {
    return dispatch => {
      getHotwallRequest().then(data => {
        dispatch(this.changeHotwallList(data))
      })
    }
  }
}

export const initState = {
  bannerList: [],
  hotwallList: []
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
    default:
      return state
  }
}
