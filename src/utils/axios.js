import axios from 'axios'

const Axios = axios.create({
  baseURL: 'http://localhost:3001'
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
