// 环境配置
const ENV_CONFIG = {
  development: {
    baseUrl: 'http://localhost:8080'
  },
  production: {
    baseUrl: 'https://vendorapi.frpee.cn'  // 这里替换为您的生产环境地址
  }
}

// 获取当前环境
let currentEnv = 'production'
// #ifdef H5
currentEnv = process.env.NODE_ENV || 'development'
// #endif

// export const BASE_URL = ENV_CONFIG[currentEnv].baseUrl
// export const BASE_URL = 'https://vendorapi.frpee.cn'
export const BASE_URL = 'http://localhost:8080'


// API路径配置
export const API = {
  vendor: {
    login: '/vendor/login',
    getToken: '/getToken'
  }
}
