/**
 * make from https://claude.ai/chat/a74e7905-67ac-40d6-8987-ac235267398c
 * TODO:tokenはログイン時に取得し　localStorage.setItem('token')する?
 */
import axios from 'axios'
import {usePage} from "@inertiajs/vue3";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000
})

axiosInstance.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('token');
    if (!token) {
      const page = usePage()
      token = page.props.apiToken
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// レスポンスインターセプター
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('401 error トークン切れ');
      // TODO:トークン切れの処理
      // リフレッシュトークンがある場合はリフレッシュ処理
      // なければログアウト処理など
    }
    return Promise.reject(error)
  }
)

export default axiosInstance
