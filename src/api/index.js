import axios from '../utils/axios'

/**
 * Find页面
 */

// 获取首页轮播图数据
export const fetchBanner = () => {
  return axios.get('/banner?type=1')
}
// 获取云村热评墙数据
export const fetchHotwall = () => {
  return axios.get('/comment/hotwall/list')
}
// 获取歌单数据，limit:取出条数，cat:分类
export const fetchRecommendPlaylists = (limit, category) => {
  return axios.get(`/top/playlist?limit=${limit}&cat=${category}`)
}
// 获取新歌，会取10个左右
export const fetchNewSongs = () => {
  return axios.get('/personalized/newsong')
}
// 获取新碟，会取10个左右
export const fetchNewAlbums = () => {
  return axios.get('/album/newest')
}

/**
 * Playlist页面
 */

// 根据歌单id，获取歌单的详细数据，但是最多只能拿1000首，但是trackIds是完整的，可以用这个请求所有的歌曲
export const fetchPlaylistDetail = id => {
  return axios.get(`/playlist/detail?id=${id}`)
}

// 根据歌曲id，获取歌曲的详细数据，/song/detail?ids=347230,347231
export const fetchSongDetail = ids => {
  return axios.get(`/song/detail/?ids=${ids}`)
}
