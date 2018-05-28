var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var apps = require('../../../app.js');


var app = getApp();
// var code = '';
// var openid = '';

Page({
  data: {
      openid: ''
  },
  destnum: function(event) {
    let that = this;
      console.log(event.detail.value);
      util.request('http://192.168.200.86:8080/platform-framework/api/user/activeGiftcard', {
        // weixinOpenid: that.data.openid,
        cardNum: event.detail.value
      }).then(function (res) {
        console.log(res);
        if(res.key == 200) {
          wx.showToast({
            title: '成功激活',
            icon: 'success',
            duration: 2000
          })
        } else if(res.key == 400) {
          wx.showToast({
            title: "激活码错误",
            image: '/static/images/icon_error.png'
          })
        }
      });
  },
  onLoad: function (options) {
    // let that = this;
    // wx.login({
    //   //获取code
    //   success: function (res) {
    //     code = res.code //返回code
    //     console.log(code);
    //     wx.request({
    //       url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxb14dd6533cffe0e6&secret=1f8a144c3b6efcecd93c90d3937e2950&js_code=' + code + '&grant_type=authorization_code',
    //       data: {},
    //       header: {
    //         'content-type': 'application/json'
    //       },
    //       success: function (res) {
    //         openid = res.data.openid //返回openid
    //         that.setData({
    //           "openid": res.data.openid 
    //         })
    //         console.log(that.data.openid)
    //       }
    //     })
    //   }
    // })
  },
  onReady: function () {

  },
  onShow: function () {

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  }
})