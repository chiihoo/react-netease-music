import axios from '../utils/axios'

export const getBannerRequest = () => {
  return axios.get('/banner?type=1')
}

export const getHotwallRequest = () => {
  return axios.get('/comment/hotwall/list')
}
