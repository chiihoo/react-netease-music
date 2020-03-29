import axios from '../utils/axios'

export const getBannerRequest = () => {
  return axios.get('/banner?type=1')
}

export const getHotwallRequest = () => {
  return axios.get('/comment/hotwall/list')
}

export const getRecommendPlaylists = (limit, category) => {
  return axios.get(`/top/playlist?limit=${limit}&cat=${category}`)
}
