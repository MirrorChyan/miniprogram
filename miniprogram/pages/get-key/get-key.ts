import {queryCdkByOrderId} from '../../api/api'
import {formatDate, getRemainingTimeText} from "../../utils/misc";

interface CDKRenderResult {
  cdk: string;
  expiredTime?: Date;
  expiredFormatStr?: string;
  remainingFormatStr?: string;
  status?: 'expired' | 'valid';
}

Page({
  data: {
    orderId: '',
    cdkResult: null as CDKRenderResult | null,
    loading: false,
    showSuccessModal: false
  },

  onLoad() {
  },

  onOrderNumberInput(e: any) {
    this.setData({orderId: e.detail.value});
  },

  onPopupVisibleChange(e: any) {
    this.setData({
      showSuccessModal: e.detail.visible
    });
  },

  async doQueryCDK() {
    const orderId = this.data.orderId.trim();

    if (!orderId) {
      await wx.showToast({
        title: '请输入订单号',
        icon: 'none'
      });
      return;
    }

    this.setData({
      loading: true,
      cdkResult: null
    });

    await wx.showToast({
      title: '查询中...',
      icon: 'loading',
      duration: 10000
    });

    try {
      const resp = await queryCdkByOrderId(orderId);
      if (resp.statusCode === 200 && resp.data.code == 0) {
        await wx.hideToast();
        const result = this.processCDKResult(resp.data);
        this.setData({
          cdkResult: result,
          showSuccessModal: true
        });
      } else {
        await wx.hideToast();
        await wx.showToast({
          title: '订单号错误或不存在',
          icon: 'none'
        });
      }
    } catch (error) {
      await wx.hideToast();
      console.error('查询CDK失败:', error);
      await wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      });
    } finally {
      this.setData({loading: false});
    }
  },

  processCDKResult({data}: any): CDKRenderResult {
    const result: CDKRenderResult = {
      cdk: data.cdk
    };

    const fieldVal = data['expired_at']
    if (fieldVal) {
      const now = Date.now().valueOf();
      const expiredTime = new Date(fieldVal).valueOf();
      const isExpired = expiredTime < now;
      result.expiredTime = data.expiredTime;
      result.expiredFormatStr = formatDate(expiredTime);
      result.remainingFormatStr = getRemainingTimeText(expiredTime);
      result.status = isExpired ? 'expired' : 'valid';
    }

    return result;
  },

  copyCDK(e: any) {
    const cdk = e.currentTarget.dataset.cdk;
    wx.setClipboardData({
      data: cdk,
      success: () => {
        wx.showToast({
          title: '复制成功',
          icon: 'success'
        });
      }
    });
  },

  closeSuccessModal() {
    this.setData({showSuccessModal: false});
  }
})