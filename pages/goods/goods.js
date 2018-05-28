var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');

Page({
  data: {
    id: 0,
    price: 1,
    goods: {},
    gallery: [],
    attribute: [],
    issueList: [],
    comment: [],
    brand: {},
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: 0,
    number: 1,
    pagecolor:'',
    pageguige:'',
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    noCollectImage: "/static/images/icon_collect.png",
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png"
  },
  getGoodsInfo: function () {
    console.log('1')
    let that = this;
    util.request(api.GoodsDetail, { id: that.data.id }).then(function (res) {
      console.log("2")
      console.log(res);
      if (res.errno === 0) {
        console.log(res.data.gallery);
        that.setData({
          goods: res.data.info,
          gallery: res.data.gallery,
          attribute: res.data.attribute,
          issueList: res.data.issue,
          comment: res.data.comment,
          brand: res.data.brand,
          specificationList: res.data.specificationList,
          productList: res.data.productList,
          userHasCollect: res.data.userHasCollect
        });
        console.log(that.data.goods)
        if (res.data.userHasCollect == 1) {
          that.setData({
            'collectBackImage': that.data.hasCollectImage
          });
        } else {
          that.setData({
            'collectBackImage': that.data.noCollectImage
          });
        }

        WxParse.wxParse('goodsDetail', 'html', res.data.info.goods_desc, that);

        that.getGoodsRelated();
      }
    });

  },

  birectBuy: function() {   //立即购买
    var that = this;
    if (this.data.openAttr == false) {
      //打开规格选择窗口
      console.log("666555")
      this.setData({
        openAttr: !this.data.openAttr,
        collectBackImage: "/static/images/detail_back.png"
      });
    } else {

      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProduct || checkedProduct.length <= 0) {
        //找不到对应的product信息，提示没有库存
        return false;
      }

      //验证库存
      if (checkedProduct.goods_number < this.data.number) {
        //找不到对应的product信息，提示没有库存
        return false;
      }

      wx.navigateTo({
        url: '../shopping/checkout/checkout?goodsSn=' + that.data.id + '&number=' + that.data.number + '&specifications=' + that.data.checkedSpecText + '&entrance=2'
      })
    }
  },

  getGoodsRelated: function () {
    let that = this;
    util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

  },
  clickSkuValue: function (event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;
    

    //判断是否可以点击

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    console.log(_specificationList)
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].specification_id == specNameId) {
        console.log(_specificationList[i].valueList.length)
        for (let j = 0; j < _specificationList[i].valueList.length; j++) {
          if (_specificationList[i].valueList[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].valueList[j].checked) {
              _specificationList[i].valueList[j].checked = false;
            } else {
              _specificationList[i].valueList[j].checked = true;
            }
          } else {
            _specificationList[i].valueList[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
    //重新计算spec改变后的信息
    this.changeSpecInfo();

    //重新计算哪些值不可以点击
  },

  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    console.log(_specificationList)
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].specification_id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });
    console.log(checkedValue)
    return checkedValue.join('_');
  },
  changeSpecInfo: function () {
    
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    console.log(checkedValue)
    // 不同规格  不同价格
    let _specificationList = this.data.specificationList;
    let that = this;
      for (var t = 0; t < _specificationList[0].valueList.length; t++) {
        if (checkedValue[0] == _specificationList[0].valueList[t].value) {
          
            that.setData({
              pagecolor: _specificationList[0].valueList[t].id
            })
            console.log(that.data.pagecolor)
          }
      }
      for (var t = 0; t < _specificationList[1].valueList.length; t++) {
        if (checkedValue[1] == _specificationList[1].valueList[t].value) {

          that.setData({
            pageguige: _specificationList[1].valueList[t].id
          })
          console.log(that.data.pageguige)
        }
      }
      let arr = that.data.pagecolor + "_" + that.data.pageguige
     
      for (var i = 0; i < that.data.productList.length; i++) {
      
        if (arr == that.data.productList[i].goods_specification_ids) {
          let  _index = i;
          util.request(api.GoodsDetail, { id: that.data.id }).then(function (res) {
            console.log(_index);
            if (res.errno === 0) {
              var rem = res.data.info;
              console.log(rem.retail_price)
              rem.retail_price = that.data.productList[_index].retail_price;
            
              that.setData({
                goods: rem
              });
            }
          });
      
          // that.setData({
          //   goods.retail_price : that.data.productList[i].retail_price
          // })
        }
      }


    // .............................


    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
      // console.log(this.data.checkedSpecText);
      // console.log(this.data.goods);
      // console.log(this.data.gallery);
      // console.log(this.data.attribute);
      // console.log(this.data.issueList);
      // console.log(this.data.comment);
      // console.log(this.data.brand);
      console.log(this.data.specificationList);   //规格 true  false
      console.log(this.data.productList); // 3 8
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }

  },
  getCheckedProductItem: function (key) {
    return this.data.productList.filter(function (v) {
      if (v.goods_specification_ids == key) {
        return true;
      } else {
        return false;
      }
    });
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log("onLoad")
    console.log(options);
    //1181000
    console.log(options.price)
    if(options.price == null) {
        console.log("无值")
    } else {
      this.setData({
        "price": options.price
      });
    }
    this.setData({
      id: parseInt(options.id)
      // id: 1181000
    });
    var that = this;
    this.getGoodsInfo();
    util.request(api.CartGoodsCount).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data)
        that.setData({
          cartGoodsCount: res.data.cartTotal.goodsCount
        });

      }
    });
    
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    console.log("onShow")
    console.log(this.data.price)
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr,
        collectBackImage: "/static/images/detail_back.png"
      });
    }
  },
  closeAttrOrCollect: function () {
    let that = this;
    if (this.data.openAttr) {
      this.setData({
        openAttr: false,
      });
      if (that.data.userHasCollect == 1) {
        that.setData({
          'collectBackImage': that.data.hasCollectImage
        });
      } else {
        that.setData({
          'collectBackImage': that.data.noCollectImage
        });
      }
    } else {
      //添加或是取消收藏
      util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, "POST")
        .then(function (res) {
          let _res = res;
          if (_res.errno == 0) {
            if ( _res.data.type == 'add') {
              that.setData({
                'collectBackImage': that.data.hasCollectImage
              });
            } else {
              that.setData({
                'collectBackImage': that.data.noCollectImage
              });
            }

          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });
    }

  },
  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
      success: function (e) {
        var page = getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    });
  },
  addToCart: function () {
    console.log('1')
    var that = this;
    if (this.data.openAttr == false) {
      console.log('2')
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr,
        collectBackImage: "/static/images/detail_back.png"
      });
    } else {
      console.log('3')
      //提示选择完整规格
      if (!this.isCheckedAllSpec()) {
        return false;
      }
      console.log('4')
      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (!checkedProduct || checkedProduct.length <= 0) {
        //找不到对应的product信息，提示没有库存
        wx.showModal({
          title: '',
          content: '没有库存',
          showCancel: false,
          confirmText: '继续',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        
        return false;
      }
      console.log("5");
      //验证库存
      if (checkedProduct.goods_number < this.data.number) {
        console.log('6')
        //找不到对应的product信息，提示没有库存
        return false;
        
      }
      console.log('7')
      //添加到购物车
      console.log(this.data.goods.id)
      console.log(this.data.number)
      console.log(checkedProduct[0].id)
      util.request(api.CartAdd, { goodsId: this.data.goods.id, number: this.data.number, productId: checkedProduct[0].id }, "POST")
        .then(function (res) {
          console.log('8')
          let _res = res;
          console.log(_res.errno)
          if (_res.errno == 0) {
            wx.showToast({
              title: '添加成功'
            });
            console.log(_res);
            that.setData({
              openAttr: !that.data.openAttr,
              cartGoodsCount: _res.data.cartTotal.goodsCount
            });
            if (that.data.userHasCollect == 1) {
              that.setData({
                'collectBackImage': that.data.hasCollectImage
              });
            } else {
              that.setData({
                'collectBackImage': that.data.noCollectImage
              });
            }
          } else {
            wx.showToast({
                                                                                                                                                                                                                                 
              image: '/static/images/icon_error.png',
              title: _res.errmsg,
              mask: true
            });
          }

        });
    }

  },
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  },
  onPullDownRefresh() {
    let that = this;
    console.log('--------下拉刷新-------')
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getGoodsInfo();
    util.request(api.CartGoodsCount).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data)
        that.setData({
          cartGoodsCount: res.data.cartTotal.goodsCount
        });

      }
    });

    // complete
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新


  }
  
})