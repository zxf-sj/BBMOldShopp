var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var app = getApp();

Page({
  data: {
    addressList: [],
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.getAddressList();
  },
  getAddressList (){
    let that = this;
    util.request(api.AddressList).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          addressList: res.data
        });
      }
    });
  },
  addressAddOrUpdate (event) {
    console.log(event)
    wx.navigateTo({
      url: '/pages/shopping/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
    });
  },
  selectAddress(event){
    console.log(event.currentTarget.dataset.addressId);

    try {
      wx.setStorageSync('addressId', event.currentTarget.dataset.addressId);
    } catch (e) {

    }

    //选择该收货地址
    // wx.navigateBack({
    //   url: '/pages/shopping/checkout/checkout'
    // });

    let pages = getCurrentPages();//当前页面
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({//直接给上移页面赋值
      address: 1
    });
    wx.navigateBack({//返回
      delta: 1
    })
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})