var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data:{
    orderList: [],
    price: ''
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数

  },
  getOrderList(){
    let that = this;
    util.request(api.OrderList).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
        that.setData({
          orderList: res.data.data
        });
        wx.hideLoading();
      }
    });
  },
  payOrder(index){
    var orderid = this.data.orderList[index.target.dataset.orderIndex].id;
    var price = this.data.orderList[index.target.dataset.orderIndex].goods_price;
    wx.redirectTo({
      url: '/pages/pay/pay?orderId=' + orderid + '&actualPrice=' + price
    })
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示

    wx.showLoading({
      title: '加载中...',
      success: function () {

      }
    });
    this.getOrderList();
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})