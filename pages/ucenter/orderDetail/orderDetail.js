var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');

Page({
  data: {
    orderId: 0,
    orderInfo: {},
    orderGoods: [],
    handleOption: {},
    shippingList: false,
    style: '',
    email: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  
  getOrderDetail() {
    let that = this;
    util.request(api.OrderDetail, {
      orderId: that.data.orderId
    }).then(function (res) {
      if (res.errno === 0) {
        console.log(res)
        if (res.data.shippingList) {
          var wuL = res.data.shippingList.pop().AcceptStation
          that.setData({
            email: wuL
          })
        }
        
        console.log(res.data);
        let arr = ["顺丰快递", "申通快递", "中通速递", "圆通速递", "天天快递", "韵达快递", "百世汇通"];
        for(var i = 0; i < arr.length; i++) {
          if (res.data.orderInfo.shipping_name == arr[i]) {

          } else {
            that.setData({
              style: res.data.orderInfo.shipping_no   //快递单号
            })
          }
        }
        if (res.data.shippingList) {
          that.setData({
            shippingList: true
          })
        }
        that.setData({
          orderInfo: res.data.orderInfo,
          orderGoods: res.data.orderGoods,
          handleOption: res.data.handleOption
        });
        //that.payTimer();
        
      }
    });
  },
  payTimer() {
    let that = this;
    let orderInfo = that.data.orderInfo;

    setInterval(() => {
      console.log(orderInfo);
      orderInfo.add_time -= 1;
      that.setData({
        orderInfo: orderInfo,
      });
    }, 1000);
  },
  cancelOrder(){
    console.log('开始取消订单');
    let that = this;
    let orderInfo = that.data.orderInfo;
    console.log(orderInfo);

    var order_status = orderInfo.order_status;
    console.log(order_status);

    var errorMessage = '';
    switch (order_status){
      case 300: {
        console.log('已发货，不能取消');
        errorMessage = '订单已发货';
        break;
      }
      case 301:{
        console.log('已收货，不能取消');
        errorMessage = '订单已收货';
        break;
      }
      case 101:{
        console.log('已经取消');
        errorMessage = '订单已取消';
        break;
      }
      case 102: {
        console.log('已经删除');
        errorMessage = '订单已删除';
        break;
      }
      case 401: {
        console.log('已经退款');
        errorMessage = '订单已退款';
        break;
      }
      case 402: {
        console.log('已经退款退货');
        errorMessage = '订单已退货';
        break;
      }
    }
      
    if (errorMessage != '') {
      console.log(errorMessage);
      util.showErrorToast(errorMessage);
      return false;
    }
    
    console.log('可以取消订单的情况');
    wx.showModal({
      title: '',
      content: '确定要取消此订单？',
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定');

          util.request(api.OrderCancel,{
            orderId: orderInfo.id
          }).then(function (res) {
            console.log(res.errno);
            if (res.errno === 0) {
              console.log(res.data);
              wx.showModal({
                title:'取消成功',
                content: res.data,
                showCancel:false,
                confirmText:'继续',
                success: function (res) {
                //  util.redirect('/pages/ucenter/order/order');
                  wx.navigateBack({
                    url: 'pages/ucenter/order/order',
                  });
                }
              });
            }
          });

        }
      }
    });
  },

  collectOrder() {
    let that = this;
    console.log("1111111111111111")
    util.request(api.ConfirmOrder, {
      orderId: that.data.orderId
    }).then(function (res) {
      console.log(res);
    });
  },

  payOrder() {
    let that = this;
    util.request(api.PayPrepayId, {
      orderId: that.data.orderId || 15
    }).then(function (res) {
      console.log(res);
      if (res.errno === 0) {
        const payParam = res.data;
        wx.requestPayment({
          'timeStamp': payParam.timeStamp,
          'nonceStr': payParam.nonceStr,
          'package': payParam.package,
          'signType': payParam.signType,
          'paySign': payParam.paySign,
          'success': function (res) {
            console.log(res);
          },
          'fail': function (res) {
            console.log(res);
          }
        });
      }
    });

  },
  logistics: function() {
    KDNWidget.run({
      serviceType: "A",
      expCode: "STO",
      expNo: "3359138259769",
    })
  },
  //跳转物流
  paylogistics: function () {
    wx.navigateTo({
      url: '../logistics/logistics?param=' + this.data.orderInfo.shipping_name + "&orderNum=" + this.data.orderInfo.shipping_no
    })
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