import axios from '../utils/axios'

export const getBannerRequest = () => {
  return axios.get('http://localhost:3001/banner?type=1')
}
