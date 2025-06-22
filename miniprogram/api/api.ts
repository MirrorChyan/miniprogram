import {API_BASE_URL} from "../config/config";
import {request} from "../utils/request";

export async function getOpenId(code: string) {
  return await request({
    url: `${API_BASE_URL}/billing/wechat/openid?code=${code}`,
    method: 'GET',
  })
}

export async function getWechatOrderList(openId: string) {
  console.log('getWechatOrderList', openId)
  return await request({
    url: `${API_BASE_URL}/billing/order/query_by_user?platform=weixin&user_id=${openId}`,
    method: 'GET',
  })
}

export async function queryCdkByOrderId(orderId: string) {
  return await request({
    url: `${API_BASE_URL}/billing/order/query?order_id=${orderId}`,
    method: 'GET',
  })
}