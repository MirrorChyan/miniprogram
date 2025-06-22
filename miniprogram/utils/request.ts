import {API_BASE_URL, REQUEST_TIMEOUT} from '../config/config'

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: any
  header?: any
}

interface RequestResponse {
  data: any
  statusCode: number
  header: any
}

export function request(options: RequestOptions, openid?: string): Promise<RequestResponse> {
  const url = options.url.startsWith('http') ? options.url : `${API_BASE_URL}${options.url}`

  return new Promise((resolve, reject) => {
    wx.request({
      url,
      method: options.method || 'GET',
      data: options.data,
      timeout: REQUEST_TIMEOUT,
      header: {
        'content-type': 'application/json',
        'openid': openid || '',
        ...options.header
      },
      success: (res) => {

        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res)
        } else {

          reject(new Error(`请求失败: ${res.statusCode}`))
        }
      },
      fail: (error) => {

        reject(error)
      }
    })
  })
}

export function get(url: string, data?: any) {
  return request({url, method: 'GET', data})
}


export function post(url: string, data?: any) {
  return request({url, method: 'POST', data})
}

