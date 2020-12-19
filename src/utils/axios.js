import axios from 'axios'

const Axios = axios.create({
  baseURL:
    process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001'
      : 'http://121.196.155.101:3000/api',

  // 设置跨域 cookie
  withCredentials: true
})

Axios.interceptors.response.use(
  res => {
    return res.data
  },
  err => {
    console.log(err)
    return Promise.reject(err)
  }
)

export default Axios
