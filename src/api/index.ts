import axios from 'axios'

const api = axios.create({
  baseURL: 'http://100.98.214.91:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

export default api
