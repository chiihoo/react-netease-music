import axios from '../utils/axios'

/**
 * Find页面
 */

// 获取首页轮播图数据
export const fetchBanner = () => {
  return axios.get('/banner?type=1')
}
// 获取推荐歌单数据，limit:取出条数，cat:分类
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
 *  YunCun页面
 */
// 获取云村热评墙数据
export const fetchHotwall = () => {
  return axios.get('/comment/hotwall/list')
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

/**
 * Player、Mini-Player页面，在Audio组件中请求
 */

//  根据歌曲id，获取url
export const fetchUrl = id => {
  return axios.get(`/song/url?id=${id}`)
}

//  根据歌曲id，获取歌词
export const fetchLyrics = id => {
  return axios.get(`/lyric?id=${id}`)
}

/**
 * 搜索页面
 */

//  默认搜索词，搜索页面搜索框默认显示
export const fetchSearchDefault = () => {
  return axios.get('/search/default')
}
//  热搜列表（详细），搜索框为空时的热搜榜区域
export const fetchSearchHotDetail = () => {
  return axios.get('/search/hot/detail')
}
//  搜索建议，搜索框有字时的推荐搜索建议
export const fetchSearchSuggest = keyword => {
  return axios.get(`/search/suggest?keywords=${keyword}&type=mobile`)
}
//  搜索结果
// limit: 返回数量，默认为30
// offset: 偏移数量，默认为0，这个的意思是返回的数据是第offset+1个limit数量的歌曲
// type: 搜索类型。默认为1，即单曲，取值意义: 1:单曲，10:专辑，100:歌手，1000:歌单，1002:用户，1004:MV，1006:歌词，1009:电台，1014:视频，1018:综合
export const fetchSearchResult = (keyword, offset = 0, limit = 30, type = 1) => {
  return axios.get(`/search?keywords=${keyword}&offset=${offset}&limit=${limit}&type=${type}`)
}
