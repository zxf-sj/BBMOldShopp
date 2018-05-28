var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var user = require('../../../services/user.js');
var app = getApp();
var code = '';
var openid = '';

Page({
  data: {
    userInfo: {},
    poten: 0,
    hiddenmodalput: true,
    openid: '',
    detailValue: '',
    shows: true
  },
  //点击按钮弹出指定的hiddenmodalput弹出框  
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //积分取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true
    });
  },
  //积分确认按钮  
  confirml: function (e) {
    let that = this;
    that.setData({
      hiddenmodalput: true
    })
    //获取openId
    that.getOpenId();
  },
  //获取openId
  getOpenId: function() {
    let that = this;
    wx.login({
      //获取code
      success: function (res) {
        code = res.code //返回code
        console.log(code);
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxb14dd6533cffe0e6&secret=1f8a144c3b6efcecd93c90d3937e2950&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: util.proxy(that.handleAddItemSucc, that)
        })
      }
    })
  },
  handleAddItemSucc: function(res) {
    let that = this;
    openid = res.data.openid //返回openid
    that.setData({
      "openid": res.data.openid
    })
    if (that.data.detailValue <= that.data.poten && that.data.detailValue !== 0) {
      // post请求
      that.integralPost();
      // get请求
      //that.integralGet();
    } else {
      that.wxPopup();
    }
  },
  //积分GET
  integralGet: function() {
    let that = this;
    util.request(api.Forward, {
      openid: that.data.openid,
      takemoney: that.data.detailValue
    }).then(function (res) {
      console.log(res);

    });
  },
  //积分POST
  integralPost: function() {
    let that = this;
    wx.request({
      url: "http://192.168.200.86:8080/platform-framework/api/transfer/pay",
      data: { openid: that.data.openid, takemoney: that.data.detailValue },
      // header: {
      //   'content-type': 'application/json' // 默认值
      // },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      method: 'post',
      success: function (res) {
        if(res.data.code == 1) {
          that.succPopup();
        } else if(res.data.code == 500) {
          that.failPopup();
        } else if(res.data.code == -1) {
          that.allFailPopup();
        } else if(res.data.code == '') {
          console.log("空")
        }
      }
    })
  },
  //成功弹窗
  succPopup: function() {
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    }) 
  },
  allFailPopup: function () {
    wx.showModal({
      title: '提示',
      content: '提现失败',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //积分小数弹窗
  failPopup: function() {
    wx.showModal({
      title: '提示',
      content: '不能输入小数',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //积分弹框
  wxPopup: function() {
    wx.showModal({
      title: '提示',
      content: '您的积分余额不足',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //bindinput事件
  btntext: function(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      "detailValue": e.detail.value
    })
      
  },
  //获取openId
  integralGetOpenId: function () {
    let that = this;
    wx.login({
      //获取code
      success: function (res) {
        code = res.code //返回code
        console.log(code);
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxb14dd6533cffe0e6&secret=1f8a144c3b6efcecd93c90d3937e2950&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: util.proxy(that.handleAddIntegralSucc, that)
        })
      }
    })
  },
  handleAddIntegralSucc: function (res) {
    let that = this;
    openid = res.data.openid //返回openid
    that.setData({
      "openid": res.data.openid
    })
    util.request(api.GetPoint, {
      openid: that.data.openid
    }).then(function (res) {
      console.log(res);
      console.log(that.data.openid)
      console.log("222")
      if (res !== '') {
        console.log("111")
        that.setData({
          'poten': res
        })
      }

    });
  },
  getPoint: function () {
    let that = this;
    this.integralGetOpenId();
    
  },
  genxin: function() {
    const updateManager = wx.getUpdateManager()

    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      console.log(res.hasUpdate)
    })


    updateManager.onUpdateReady(function () {
      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })

    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  },
  sss: function(e) {
    console.log(e)
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
    this.getPoint();
    this.genxin();
    
  },
  onReady: function () {
    let info = wx.getStorageSync('userInfo');
    if (info == '') {
      this.setData({
        'shows': true
      })
    }
  },
  onShow: function () {
    
    this.getPoint();
    this.setData({
      point: app.globalData.userInfo.point
    })
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');

    //页面显示
    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    }

    this.setData({
      userInfo: app.globalData.userInfo,
    });

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭
  },
  // goLogin(){
  //   user.loginByWeixin().then(res => {
  //     this.setData({
  //       userInfo: res.data.userInfo
  //     });
  //     app.globalData.userInfo = res.data.userInfo;
  //     app.globalData.token = res.data.token;
  //   }).catch((err) => {
  //     console.log(err)
  //   });
  // },
  exitLogin: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  },
  getUser: function(res) {
    console.log(res);
    let that = this;
    that.setData({
      'userInfo': res.detail.userInfo,
      'shows': false
    })
    
  }
})