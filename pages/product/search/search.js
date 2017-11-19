//index.js
//获取应用实例
var app = getApp();

Page({
  data: {
    'imageRootPath': '',
    'warelist': [],
    'source':'',   //入口来源
    'name':'',
    'searchStatus': false,    //是否进行搜索
    'hide': 'hide'
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
    this.setData({
      source: options.source
    });
  },

  //搜索框触发
  bindNameChange:function(e){
    var name = e.detail.value;
    this.setData({
      name: name
    });
    if (name!=''){
      this.setData({
        searchStatus: true
      });
    }else{
      this.setData({
        searchStatus: false
      });
    }
  },

  //搜索商品
  searchProduct: function () {
    var self = this;
    var postData = {
      warename: self.data.name
    };
  
    app.ajax({
      url: app.globalData.serviceUrl + '/mwaresearch.html',
      data: postData,
      method: 'POST',
      successCallback: function (res) {
        if (res.data) {
          var isShow = res.data.warelist.length > 0 ? 'hide' : 'show';
          self.setData({
            imageRootPath: res.data.imageRootPath,
            warelist: res.data.warelist,
            hide: isShow
          });
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //取消搜索
  cancelSearch:function(){
    var source = this.data.source;
    if (source =='index'){
      wx.switchTab({
        url: '/pages/index/index'
      })
    } else if (source == 'list') {
      wx.switchTab({
        url: '/pages/product/list/list'
      })
    }
  },

  //跳转到产品详情
  productInfo: function (e) {
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/product/info/info?id=' + id
    })
  }

})