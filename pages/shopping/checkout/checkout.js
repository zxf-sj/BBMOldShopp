var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');

var app = getApp();
var code = '';
var openid = '';

Page({
  data: {
    number: 1,
    goodsSn: '',
    specifications: '',
    entrance: 1,
    checkedGoodsList: [],
    checkedAddress: {},
    checkedCoupon: [],
    couponList: [],
    goodsTotalPrice: 0.00, //商品总价
    freightPrice: 0.00,    //快递费
    couponPrice: 0.00,     //优惠券的价格
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    actualPriceindex: 0.00, //记录总价
    addressId: 0,
    couponId: 0,
    integralPrice: 300,
    integralnum: 0,
    judge: true,
    integral: 0,
    openid: '',
    inputTxt: 0,
    address: ''
  },
  getPoint: function () {
    let that = this;
    that.getOpenId();
  },
  //获取openId
  getOpenId: function () {
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
  handleAddItemSucc: function (res) {
    let that = this;
    openid = res.data.openid //返回openid
    that.setData({
      "openid": res.data.openid
    })
    console.log(that.data.openid)
    util.request(api.GetPoint, {
      'openid': that.data.openid
    }).then(function (res) {
      console.log(res);
      that.setData({
        'integral': res
      })
    });
  },
  onLoad: function (options) {
    this.getPoint();
    console.log(options);
    if (options.entrance == '2') {
      this.setData({
        'number': options.number,
        'goodsSn': options.goodsSn,
        'specifications': options.specifications,
        'entrance': options.entrance
      })
    }
    
    // 页面初始化 options为页面跳转所带来的参数

    try {
      var addressId = wx.getStorageSync('addressId');
      console.log(wx.getStorageSync('addressId'))
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }

      var couponId = wx.getStorageSync('couponId');
      console.log(couponId+"11111111111")
      if (couponId) {
        this.setData({
          'couponId': couponId
        });
      }
    } catch (e) {
      // Do something when catch error
    }


  },
  getCheckoutInfo: function () {
    let that = this;
    console.log(that.data.addressId)
    util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: that.data.couponId }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          actualPriceindex: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon,
          couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        });
        console.log(that.data.checkedGoodsList[0].sale_num);
      }
      wx.hideLoading();
    });
    console.log(that.data.actualPriceindex)
  },

  getCheckoutInfoB: function () {
    let that = this;
    util.request(api.CartCheckout, { addressId: that.data.addressId, couponId: that.data.couponId, numBer: that.data.number, goodsSn: that.data.goodsSn, specifications: that.data.specifications }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          checkedGoodsList: res.data.checkedGoodsList,
          checkedAddress: res.data.checkedAddress,
          actualPrice: res.data.actualPrice,
          checkedCoupon: res.data.checkedCoupon,
          couponList: res.data.couponList,
          couponPrice: res.data.couponPrice,
          freightPrice: res.data.freightPrice,
          goodsTotalPrice: res.data.goodsTotalPrice,
          orderTotalPrice: res.data.orderTotalPrice
        });
        
      }
      wx.hideLoading();
    });
    console.log(that.data.actualPriceindex)
  },

  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd',
    })
  },
  //积分失去焦点
  bindfocusInput: function(e) {
    let that = this;
    that.setData({
      actualPrice: that.data.actualPriceindex
    })
  },
  integralInput: function(e) {
    let that = this;
    if (e.detail.value <= this.data.actualPrice || e.detail.value == 0) {
      
      that.setData({
        integralnum: e.detail.value,
        judge: true
      })
      if (e.detail.value == 0 || e.detail.value == '') {
      
        that.setData({
          actualPrice: that.data.actualPriceindex
        })
      } else {
        that.setData({
          actualPrice: that.data.actualPrice - e.detail.value
        })
      }
    } else {
      wx.showToast({
        title: '积分不足',
        duration: 2000
      })
      that.setData({
        judge: false
      })
    }
    
  },
  // onReady: function () {
  //   // 页面渲染完成

  // }, 
  onReady: function () {
    // 页面显示
    console.log("1")
    wx.showLoading({
      title: '加载中...',
    })
    
    if (this.data.entrance == '1') {
      this.getCheckoutInfo();
    } else {
      this.getCheckoutInfoB();
    }
    let that = this;
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];
    if (currPage.data.selAddress) {
      console.log(currPage.data.address)
      that.setData({//将携带的参数赋值
        address: currPage.data.address,
        actualPrice: 10
      });
    }
    console.log(that.data.actualPrice)
  },
  onShow: function() {
    let that = this;

    

    if (that.data.address == 1) {
      try {
        var addressId = wx.getStorageSync('addressId');
        console.log(wx.getStorageSync('addressId'))
        if (addressId) {
          that.setData({
            'addressId': addressId
          });
        }

        var couponId = wx.getStorageSync('couponId');
        console.log(couponId + "11111111111")
        if (couponId) {
          that.setData({
            'couponId': couponId
          });
        }
      } catch (e) {
        // Do something when catch error
      }
      that.getPoint();
      if (that.data.entrance == '1') {
        that.getCheckoutInfo();
      } else {
        that.getCheckoutInfoB();
      }
    }else {
      console.log("失败")
    }
    
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  //去付款Btn
  submitOrder: function () {
    var addressIdb = wx.getStorageSync('addressId');
    if (addressIdb) {
      this.setData({
        'addressId': addressIdb
      });
    }
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }

    if (this.data.judge == false) {
      return false;
    }
    util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId, point: this.data.integralnum }, 'POST').then(res => {
      let that = this;
      if (res.errno === 0) {
        const orderId = res.data.orderInfo.id;
        pay.payOrder(parseInt(orderId)).then(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=1&orderId=' + orderId + "&point=" + that.data.integralnum
          });
        }).catch(res => {
          wx.redirectTo({
            url: '/pages/payResult/payResult?status=0&orderId=' + orderId + "&point=" + that.data.integralnum
          });
        });
      } else {
        util.showErrorToast('下单失败');
      }
    });
  }
})