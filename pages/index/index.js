const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    newGoods: [],
    hotGoods: [],
    hangjiaGoodsList: [],
    hangjiaGoodsListA: [],
    hangjiaGoodsListB: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: [],
    clock: '',
    topics1: [],
    topics2: [],
    topics3: [],
    topics4: [],
    topics5: [],
    topics6: [],
    topics7: [],
    goodsCount: 0
  },
  onPageScroll: function (res) {
  },
  getUser: function(res) {
  },
  onShareAppMessage: function () {
    return {
      title: ' ',
      desc: ' ',
      path: '/pages/index/index'
    }
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          hangjiaGoodsList: res.data.hangjiaGoodsList,
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          brand: res.data.brandList,
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel,
          goodsCount: res.data.goodsCount,
          topics1: res.data.likeGoodsList
        });
        var num = [];
        var ltl = [];
        for(var i = 0; i < 8; i++) {
          
          if(i < 4) {
            num.push(that.data.hangjiaGoodsList[i]);
          } else {
            ltl.push(that.data.hangjiaGoodsList[i]);
          }
        }
        that.setData({
          hangjiaGoodsListA: num,
          hangjiaGoodsListB: ltl
        })
    
      }
      
    });
  },

  secondKill: function() {
    countdown(this);

    var total_micro_second = 10 * 1000;
    /* 毫秒级秒杀倒计时 */
    function countdown(that) {
      // 渲染倒计时时钟
      that.setData({
        clock: dateformat(total_micro_second)//格式化时间
      });

      if (total_micro_second <= 0) {
        that.setData({
          clock: "秒杀结束"
        });
        // timeout则跳出递归
        return;
      }

      //settimeout实现倒计时效果
      setTimeout(function () {
        // 放在最后--
        total_micro_second -= 10;
        countdown(that);
      }
        , 10)//注意毫秒的步长受限于系统的时间频率，于是我们精确到0.01s即10ms
    }

    // 时间格式化输出，如1天天23时时12分分12秒秒12 。每10ms都会调用一次
    function dateformat(micro_second) {
      // 总秒数
      var second = Math.floor(micro_second / 1000);
      // 天数
      var day = Math.floor(second / 3600 / 24);
      // 总小时
      var hr = Math.floor(second / 3600);
      // 小时位
      var hr2 = hr % 24;
      // 分钟位
      var min = Math.floor((second - hr * 3600) / 60);
      // 秒位
      var sec = (second - hr * 3600 - min * 60);// equal to => var sec = second % 60;
      // 毫秒位，保留2位
      var micro_sec = Math.floor((micro_second % 1000) / 10);
      return day + "天" + hr2 + "时" + min + "分" + sec + "秒" + micro_sec;
    }


  },
  getGoodsList: function () {
    var that = this;
    //user.loginByWeixin();
    util.request(api.GoodsList, { categoryId: 1005002, page: 1, size: 8 })
      .then(function (res) {
        that.setData({
          topics: res.data.goodsList,
        });
      })
      // .then(
        // util.request(api.GoodsList, { categoryId: 1011000, page: 1, size: 8 })
        //   .then(function (res) {
        //     console.log(res.data.goodsList);
        //     that.setData({
        //       topics1: res.data.goodsList,
        //     });
        //  })
        //.then(
        // util.request(api.GoodsList, { categoryId: 1012000, page: 1, size: 8 })
        //   .then(function (res) {
        //     console.log(res.data.goodsList);
        //     that.setData({
        //       topics2: res.data.goodsList,
        //     });
        //   }).then(
        //   util.request(api.GoodsList, { categoryId: 1005002, page: 1, size: 8 })
        //     .then(function (res) {
        //       console.log(res.data.goodsList);
        //       that.setData({
        //         topics3: res.data.goodsList,
        //       });
        //     }).then(
        //     util.request(api.GoodsList, { categoryId: 1008000, page: 1, size: 8 })
        //       .then(function (res) {
        //         console.log(res.data.goodsList);
        //         that.setData({
        //           topics4: res.data.goodsList,
        //         });
        //       }).then(
        //       util.request(api.GoodsList, { categoryId: 1010000, page: 1, size: 8 })
        //         .then(function (res) {
        //           console.log(res.data.goodsList);
        //           that.setData({
        //             topics5: res.data.goodsList,
        //           });
        //         }).then(
        //         util.request(api.GoodsList, { categoryId: 1013001, page: 1, size: 8 })
        //           .then(function (res) {
        //             console.log(res.data.goodsList);
        //             that.setData({
        //               topics6: res.data.goodsList,
        //             });
        //           }).then(
        //           util.request(api.GoodsList, { categoryId: 1019000, page: 1, size: 6 })
        //             .then(function (res) {
        //               console.log(res.data.goodsList);
        //               that.setData({
        //                 topics7: res.data.goodsList,
        //               });
        //             })
        //           )
        //         )
        //       )
        //     )
        //   )
        //)
      //)  
  },
  
  onLoad: function (options) {
    this.getIndexData();
    this.secondKill();
    this.getGoodsList();
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
  },
  onPullDownRefresh() {
    let that = this;
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getIndexData();
    this.secondKill();

    // complete
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  }
  
})
