import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:3001'

axios.interceptors.response.use(
  res => res.data,
  err => {
    console.log(err)
    return Promise.reject(err)
  }
)

export default axios
