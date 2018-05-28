const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    activeImg: '',
    activeShop: '',
    banId: '123'
  },
  getCartList: function () {
    let that = this;
    util.request(api.Activity, {name: that.data.banId}).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          activeImg: res.data[0].deal_pic0,
          activeShop: res.data[1]
        });
      }
      console.log(that.data.activeShop)
    });
  },
  suanfa: function() {
    let that = this;
    
  },
  onLoad: function (options) {

    this.setData({
      banId: options.id
    })
    this.getCartList();
    this.suanfa();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示  
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }

})