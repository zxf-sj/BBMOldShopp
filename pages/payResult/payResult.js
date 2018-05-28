var util = require('../../utils/util.js');
var api = require('../../config/api.js');
const pay = require('../../services/pay.js');

var app = getApp();
Page({
  data: {
    status: false,
    orderId: 0
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.orderId || 24,
      status: options.status
    })
  },
  onReady: function () {

  },
  onShow: function () {
    // 页面显示
    wx.hideLoading();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  payOrder() {
    pay.payOrder(parseInt(this.data.orderId)).then(res => {
      console.log(res);
      this.setData({
        status: true
      });

      // wx.request({
      //   url: 'http://192.168.200.90:8080/platform-framework/api/pay/notify', //仅为示例，并非真实的接口地址
      //   data: {},
      //   header: {
      //     'content-type': 'application/json' // 默认值
      //   },
      //   method: 'post',
      //   success: function (res) {
      //     console.log(res.data)
      //   }
      // })

    }).catch(res => {
      util.showErrorToast('支付失败');

      // wx.request({
      //   url: 'http://192.168.200.90:8080/platform-framework/api/pay/notify', //仅为示例，并非真实的接口地址
      //   data: {},
      //   header: {
      //     'content-type': 'application/json' // 默认值
      //   },
      //   method: 'post',
      //   success: function (res) {
      //     console.log(res.data)
      //   }
      // })

    });
  }
})