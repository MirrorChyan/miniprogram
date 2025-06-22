import {CONTACT, ROUTES} from '../../config/config'
import {getOpenId, getWechatOrderList} from "../../api/api";
import {formatDate} from "../../utils/misc";

interface OrderItem {
  cdk: string;
  expiredTime: number;
  expiredFormatStr: string;
  status?: 'expired' | 'valid' | 'transferred';
}

Component({
  data: {

    showOrderList: false,
    showGetKey: false,
    showFeedback: false,

    orderList: [] as OrderItem[],

    openid: '',


    qqGroupNumber: CONTACT.qqGroupNumber
  },

  lifetimes: {
    attached() {
      this.getOpenId()
    }
  },

  methods: {
    async getOpenId() {
      try {
        const result = await wx.login()
        if (result.code) {
          const resp = await getOpenId(result.code);
          if (resp.data?.data?.openid) {
            this.setData({openid: resp.data.data.openid})
            return true
          }
        }
        return false
      } catch (error) {
        console.error('获取openid失败:', error)
        return false
      }

    },

    async onFetchCdkList() {
      await Promise.all([
        this.getOpenId(),
        wx.showLoading({title: '查询中...'})
      ])


      try {
        const resp = await getWechatOrderList(this.data.openid)
        console.log(resp)
        if (resp.data) {
          const processedOrders = this.processOrderList(resp.data.data);
          this.setData({
            orderList: processedOrders,
            showOrderList: true
          })
          await wx.hideLoading()

        } else {
          await wx.hideLoading()
          await wx.showToast({
            title: '查询失败',
            icon: 'none'
          })
        }
      } catch (error) {
        console.log(error)
        await wx.hideLoading()
        await wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        })
      }
    },

    processOrderList(orders: any[]): OrderItem[] {
      console.log(orders)
      if (!orders) {
        return []
      }
      const now = Date.now();
      const m: any = {}
      const val = orders.sort((a, b) => {
        return new Date(b['created_at']).valueOf() - new Date(a['created_at']).valueOf()
      }).filter(e => {
        if (m[e['cdk']]) {
          return false
        }
        m[e['cdk']] = true
        return true
      })
      return val.map(order => {
        const expiredTime = new Date(order['expired_at']);
        const expiredTs = expiredTime.valueOf();
        const isExpired = expiredTs < now;
        console.log(order)
        let status: 'expired' | 'valid' | 'transferred' = 'valid'
        if (isExpired) {
          status = order['transferred'] === -1 ? 'transferred' : 'expired'
        }
        return {
          cdk: order.cdk,
          expiredTime: expiredTime.valueOf(),
          status: status,
          expiredFormatStr: formatDate(expiredTs)
        };
      });
    },


    countdownTimer: null as any,


    closeOrderList() {
      this.setData({showOrderList: false})
    },

    onOrderListVisibleChange(e: any) {
      if (!e.detail.visible) {
        this.closeOrderList();
      }
    },

    async onQueryCDK() {
      await wx.navigateTo({
        url: ROUTES.getkey
      })
    },

    closeCDKQuery() {
      this.setData({showGetKey: false})
    },

    onFeedback() {
      this.setData({showFeedback: true})
    },

    closeFeedback() {
      this.setData({showFeedback: false})
    },

    onFeedbackVisibleChange(e: any) {
      if (!e.detail.visible) {
        this.closeFeedback();
      }
    },

    copyCDK(e: any) {
      const cdk = e.currentTarget.dataset.cdk
      wx.setClipboardData({
        data: cdk,
        success: () => {
          wx.showToast({
            title: '复制成功',
            icon: 'success'
          })
        }
      })
    },


    copyQQ() {
      wx.setClipboardData({
        data: this.data.qqGroupNumber,
        success: () => {
          wx.showToast({
            title: '已复制',
            icon: 'success'
          })
        }
      })
    },


    request(options: any): Promise<any> {
      return new Promise((resolve, reject) => {
        wx.request({
          ...options,
          header: {
            'content-type': 'application/json',
            'openid': this.data.openid || ''
          },
          success: resolve,
          fail: reject
        })
      })
    },


    preventDefault() {

    }
  }
})
