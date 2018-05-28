Page({
  data: {
    param: '',
    orderNum: '',
    dataInfo: '',
    params: ''
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数 
    console.log(options)
    let that = this;
    var timer = '';
    var timers = '';
    var arr = ["顺丰快递", "申通快递", "中通速递", "圆通速递", "天天快递", "韵达快递" ,"百世汇通"];
    var array = ["shunfeng", "shentong", "zhongtong", "yuantong", "tiantian", "yunda", "baishi"];
    
    for(var i=0; i<arr.length; i++) {
      if(options.param == arr[i]) {
        console.log('111')
        timer = array[i];
        timers = arr[i];
      }
    }

    that.setData({
      "param":timer,
      "orderNum":options.orderNum,
      "params": timers
    }) 
    
  },
  onShow: function () {
    this.getExpressInfo(this.data.param, this.data.orderNum);
  },
  //传入快递公司、快递单号获取快递信息  
  getExpressInfo: function (param, orderNum) {
    console.log(param, orderNum);
    var that = this;//由于函数里面又嵌套了一个函数，所以需要先保存this指向，方便后面将数据传递到data里面，  
    //读取快递数据  
    wx.request({
      //3323211723270  
      url: 'http://www.kuaidi100.com/query?type=' + param + '&postid=' + orderNum + '',
      //数据读取成功  
      success: function (res) {
        var data = res.data.data;
        console.log(data);
        //将数据传递给data  
        that.setData({ dataInfo: data });
      },
      //数据读取失败  
      fail: function () {
        console.log('订单号有误')
      }
    })
  }
})  