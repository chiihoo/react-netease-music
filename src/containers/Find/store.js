import produce from 'immer'
import { getBannerRequest } from '../../api'

export const actionTypes = {
  CHANGE_BANNER_LIST: '/home/find/changeBannerList'
}

export const actions = {
  changeBannerList(data) {
    return { type: actionTypes.CHANGE_BANNER_LIST, data }
  },
  fetchBannerList() {
    return dispatch => {
      getBannerRequest().then(data => {
        dispatch(this.changeBannerList(data))
      })
    }
  }
  // 在对象上定义方法不要用箭头函数，因为这样this不会指向该对象
  // fetchBannerList: () => dispatch => {
  //   getBannerRequest().then(data => {
  //     dispatch(actions.changeBannerList(data))
  //   })
  // }
}

export const initState = {
  bannerList: []
}

export const FindReducer = (state = initState, action) => {
  switch (action.type) {
    case actionTypes.CHANGE_BANNER_LIST:
      return produce(state, state => {
        state.bannerList = action.data.banners
      })
    default:
      return state
  }
}
