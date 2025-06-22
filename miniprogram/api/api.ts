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
  const now = new Date().getTime();
  const list = [
    {
      cdk: "0badf00d0c3b372c5b8757dc3",
      expiredTime: now + 30 * 24 * 60 * 60 * 1000,
    },
    {
      cdk: "0badf00d0c3b372c5b8757dc3",
      expiredTime: now + 60 * 60 * 1000,
    },
    {
      cdk: "0badf00d0c3b372c5b8757dc3",
      expiredTime: now - 24 * 60 * 60 * 1000,
    },
    {
      cdk: "0badf00d0c3b372c5b8757dc3",
      expiredTime: now - 24 * 60 * 60 * 1000,
    }, {
      cdk: "0badf00d0c3b372c5b8757dc3",
      expiredTime: now - 24 * 60 * 60 * 1000,
    }, {
      cdk: "0badf00d0c3b372c5b8757dc",
      expiredTime: now - 24 * 60 * 60 * 1000,
    }, {
      cdk: "0badf00d0c3b372c5b8757dc",
      expiredTime: now - 24 * 60 * 60 * 1000,
    }, {
      cdk: "0badf00d0c3b372c5b8757dc",
      expiredTime: now - 24 * 60 * 60 * 1000,
    }, {
      cdk: "0badf00d0c3b372c5b8757dc",
      expiredTime: now - 24 * 60 * 60 * 1000,
    }, {
      cdk: "0badf00d0c3b372c5b8757dc",
      expiredTime: now - 24 * 60 * 60 * 1000,
    }, {
      cdk: "0badf00d0c3b372c5b8757dc",
      expiredTime: now - 24 * 60 * 60 * 1000,
    }, {
      cdk: "0badf00d0c3b372c5b8757dc",
      expiredTime: now - 24 * 60 * 60 * 1000,
    }, {
      cdk: "0badf00d0c3b372c5b8757dc",
      expiredTime: now - 24 * 60 * 60 * 1000,
    },
  ]
  return {
    data: list,
  }
}

export async function queryCdkByOrderId(orderId: string) {
  return await request({
    url: `${API_BASE_URL}/billing/order/query?order_id=${orderId}`,
    method: 'GET',
  })
}