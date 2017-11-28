var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalSpecShow: false,
    imageRootPath:'',
    cartList: [],
    selectAllStatus:true,  //默认全选
    updId:'',  //修改id
    updName:'',  //修改的商品
    updSizeName:'',  //修改的规格
    updKuncun:0,  //修改的库存
    updRentDate:0,  //修改的租赁月数
    updNums:0,  //修改的数量
    totalMoney:0   //总金额
  },

  onShow: function () {
    //获取数据
    this.getCartInfo();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onLoad: function (options) {
  },

  //获取列表数据
  getCartInfo:function(){
    var self = this;
    var postData = {
      token: app.globalData.token
    };

    app.ajax({
      url: app.globalData.serviceUrl + 'mrentlist.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if (res.code == 0) {
          //列表处理，默认全选
          var retList = [];
          if (res.data.mrentlist != null && res.data.mrentlist.length > 0) {
            for (var i = 0; i < res.data.mrentlist.length; i++) {
              var singleObj = res.data.mrentlist[i];
              singleObj.selected = true;
              retList.push(singleObj);
            }
          }
          self.setData({
            imageRootPath: res.data.imageRootPath,
            cartList: retList,
            selectAllStatus:true
          });

          self.countTotalMoney();  //计算总金额
        }
      },
      failCallback: function (res) {
        console.log(res);
      }
    });
  },

  //计算总金额
  countTotalMoney:function(){
    var cartList = this.data.cartList; 
    var money=0;
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].selected) {
        money = money+cartList[i].total_money
      }
    }
    this.setData({
      totalMoney: money
    });
  },

  //单选框事件
  selectList:function(e){
    var index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    var cartList = this.data.cartList;                    // 获取购物车列表
    var selected = cartList[index].selected;         // 获取当前商品的选中状态
    cartList[index].selected = !selected;              // 改变状态
    this.setData({
      cartList: cartList
    });

    //判断是否全选
    var selectAllStatus=true;
    for (var i = 0; i < cartList.length;i++){
      if (!cartList[i].selected){
        selectAllStatus=false;
        break;
      }
    }
    this.setData({
      selectAllStatus: selectAllStatus
    });
    this.countTotalMoney();  //计算总金额
  },

  //全选事件
  selectAll:function(e){
    var selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    var cartList = this.data.cartList;

    for (var i = 0; i < cartList.length; i++) {
      cartList[i].selected = selectAllStatus;            // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      cartList: cartList
    });
    this.countTotalMoney();  //计算总金额
  },

  //编辑修改
  updateCartBySel:function(e){
    //获取勾选项
    var self=this;
    var selCart=null;
    var cartList = self.data.cartList;
    var selNums=0;
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].selected) {
        selCart = cartList[i];
        selNums = selNums+1;
      }
    }
    if (selNums==0){
      self.showMsg('请选择一个进行修改');
      return false;
    }
    if (selNums > 1) {
      self.showMsg('只能选择一个进行修改');
      return false;
    }
    this.setData({
      modalSpecShow: true,
      updId: selCart.id,  //修改id
      updName: selCart.name,  //修改的商品
      updKuncun: selCart.kuncun,  //修改的商品库存
      updSizeName: selCart.sizename,  //修改的规格
      updRentDate: selCart.rent_date,  //修改的租赁月数
      updNums: selCart.number  //修改的数量
    });
  },

  //弹框修改
  updateCart:function(e){
    var index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    var cartList = this.data.cartList;                    // 获取购物车列表
    var selCart = cartList[index];   //选中修改的购物车
    this.setData({
      modalSpecShow: true,
      updId: selCart.id,  //修改id
      updName: selCart.name,  //修改的商品
      updKuncun: selCart.kuncun,  //修改的商品库存
      updSizeName: selCart.sizename,  //修改的规格
      updRentDate: selCart.rent_date,  //修改的租赁月数
      updNums: selCart.number //修改的数量
    });
  },

  //关闭弹框
  closeModal: function () {
    this.setData({
      modalSpecShow: false
    });
  },

  //租用月数输入
  bindRentdatesChange: function (e) {
    this.setData({
      updRentDate: e.detail.value
    });
  },
  //添加租用月数
  addRentdates: function () {
    var self = this;
    var updRentDate = self.data.updRentDate;
    if (/^[0-9]+$/.test(updRentDate)) {
      updRentDate = Number(updRentDate);
      updRentDate = updRentDate + 1;
      self.setData({
        updRentDate: updRentDate
      });
    } else {
      self.showMsg('请输入正确的租用月数');
      return false;
    }
  },
  //减少租用月数
  reduceRentdates: function () {
    var self = this;
    var updRentDate = self.data.updRentDate;
    if (/^[0-9]+$/.test(updRentDate)) {
      updRentDate = Number(updRentDate);
      updRentDate = updRentDate > 1 ? updRentDate - 1 : 1;
      self.setData({
        updRentDate: updRentDate
      });
    } else {
      self.showMsg('请输入正确的租用月数');
      return false;
    }
  },

  //数量输入
  bindNumberChange: function (e) {
    this.setData({
      updNums: e.detail.value
    });
  },
  //添加数量
  addNumber: function () {
    var self = this;
    var updNums = self.data.updNums;
    var updKuncun = self.data.updKuncun;
    if (/^[0-9]+$/.test(updNums)) {
      updNums = Number(updNums);
      updKuncun = Number(updKuncun);
      if (updNums + 1 < updKuncun) {
        updNums = updNums + 1;
      } else {
        updNums = updKuncun;
      }
      self.setData({
        updNums: updNums
      });
    } else {
      self.showMsg('请输入正确的数量');
      return false;
    }
  },
  //减少数量
  reduceNumber: function () {
    var self = this;
    var updNums = self.data.updNums;
    if (/^[0-9]+$/.test(updNums)) {
      updNums = Number(updNums);
      updNums = updNums > 1 ? updNums - 1 : 1;
      self.setData({
        updNums: updNums
      });
    } else {
      self.showMsg('请输入正确的数量');
      return false;
    }
  },

  //提交修改
  confirmModal: function (e, modalName) {
    var self = this;
    //租用月数
    var rentdates = self.data.updRentDate;
    if (/^[0-9]+$/.test(rentdates) && rentdates != 0) {
      rentdates = Number(rentdates)
    } else {
      self.showMsg('请输入正确的租用月数');
      return false;
    }

    //租赁数量
    var numbers = self.data.updNums;
    if (/^[0-9]+$/.test(numbers) && numbers != 0) {
      numbers = Number(numbers)
    } else {
      self.showMsg('请输入正确的数量');
      return false;
    }
    var updKuncun = self.data.updKuncun;
    if (numbers > updKuncun) {
       self.showMsg('数量不能大于库存');
       return false;
    }

    var postData = {
      token: app.globalData.token,
      id: self.data.updId,
      rent_date: rentdates,
      number: numbers
    };
    app.ajax({
      url: app.globalData.serviceUrl + 'mrentupdate.htm',
      data: postData,
      method: 'GET',
      successCallback: function (res) {
        if(res.code==0){
          //修改成功，重新赋值
          var cartList = self.data.cartList
          for (var i = 0; i < cartList.length; i++) {
            if (cartList[i].id == self.data.updId) {
              cartList[i].rent_date = rentdates;
              cartList[i].number = numbers;
              break;
            }
          }
          self.setData({
            modalSpecShow: false,
            cartList: cartList
          });
        }
      }
    })
  },

  //提交删除
  deleteModal:function(e){
    var self = this;
    wx.showModal({
      title: '提示',
      content: '确定删除？',
      success: function (res) {
        if (res.confirm) {
          var id = self.data.updId;
          var postData = {
            token: app.globalData.token,
            id: id
          };
          app.ajax({
            url: app.globalData.serviceUrl + 'mrentdel.htm',
            data: postData,
            method: 'POST',
            successCallback: function (res) {
              if (res.code == 0) {
                //删除成功，直接在数组删除
                var cartList = self.data.cartList
                for (var i = 0; i < cartList.length;i++){
                  if (cartList[i].id == self.data.updId){
                    cartList.splice(i,1);
                    break;
                  }
                }
                self.setData({
                  modalSpecShow: false,
                  cartList: cartList
                });
              }
            },
            failCallback: function (res) {
              console.log(res);
            }
          });
        }
      }
    })
  },

  //进行下单
  gotoConfirm:function(){
    //获取勾选项
    var self=this;

    var wareids = [];  //下单物品id
    var waresizes = [];  //下单规格id
    var rentdates = [];   //下单租赁月数
    var numbers = [];   //下单租赁数量
    var rentids = [];
    var cartList = self.data.cartList;
    var selNums = 0;

    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].selected) {
        var selCart = cartList[i];

        wareids.push(selCart.wareid);
        waresizes.push(selCart.sizeid);
        rentdates.push(selCart.rent_date);
        numbers.push(selCart.number);
        rentids.push(selCart.id);
        selNums = selNums + 1;
      }
    }
    if (selNums == 0) {
      self.showMsg('至少选择一个进行下单');
      return false;
    }
    //跳转到订单提交页面 
    wx.navigateTo({
      url: '/pages/order/confirm/confirm?wareids=' + wareids.join(",") + '&numbers=' + numbers.join(",") + '&waresizes=' + waresizes.join(",") + '&rentdates=' + rentdates.join(",") + '&rentids=' + rentids.join(",")
    })
  },

  showMsg: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      confirmText: '我知道了'
    });
  }
})