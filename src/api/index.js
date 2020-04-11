import axios from '../utils/axios'

// 获取首页轮播图数据
export const getBannerRequest = () => {
  return axios.get('/banner?type=1')
}
// 获取云村热评墙数据
export const getHotwallRequest = () => {
  return axios.get('/comment/hotwall/list')
}
// 获取歌单数据，limit:取出条数，cat:分类
export const getRecommendPlaylistsRequest = (limit, category) => {
  return axios.get(`/top/playlist?limit=${limit}&cat=${category}`)
}
// 获取新歌，会取10个左右
export const getNewSongsRequest = () => {
  return axios.get('/personalized/newsong')
}
// 获取新碟，会取10个左右
export const getNewAlbumsRequest = () => {
  return axios.get('/album/newest')
}
