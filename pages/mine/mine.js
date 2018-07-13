// pages/mine/mine.js
var app=getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    canuse:false,
    isAuthorized: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    items: [{
      id: 1,
      name: '我的投稿',
      iconPath: './contribution.png'
    },{
      id: 2,
      name: '我的收藏',
      iconPath: './collection.png'
    }, {
      id: 3,
      name: '我的設置',
      iconPath: './setting.png'
    }]
  },
  turnToMsgPage:function(e){

    wx.navigateTo({
      url: './msg/msg'
    })
  },
  bindGetUserInfo: function (e) {
    var _this=this;
    var userInfo = e.detail.userInfo;
    if(userInfo){
      app.globalData.userInfo=userInfo;
      wx.myRequest({
        url: app.globalData.domain + '/oneUserJoke',
        method: 'POST',
        data: app.globalData.userInfo,
        success: function (res) {
          if (res.data.code === 0) {
            app.globalData.userInfo = res.data.data[0];
             app.globalData.canuse = true;
            _this.setData({ canuse:true });

            app.globalData.isAuthorized = true;
            _this.setData({
              isAuthorized: true
            })
          }
        },
        complete: function () {
          console.log('app.globalData:' + JSON.stringify(app.globalData));
        }
      })
    }
  },
  showErrorToast:function(){
    wx.showToast({
      title: '获取个人信息失败',
      icon: 'none',
      duration: 2000
    })
  },
  bindTapCollection:function(){
    if(!this.data.canuse){
      this.showErrorToast();
      return;
    }
    wx.navigateTo({
      url: './collection/collection'
    });
  },
  bindTapToContribution: function () {
    if (!this.data.canuse) {
      this.showErrorToast();
      return;
    }
    wx.navigateTo({
      url: './contribution/contribution'
    });
  },
  bindTapToSetting: function (e) {
    if (!this.data.canuse) {
      this.showErrorToast();
      return;
    }
    wx.navigateTo({
      url: './setting/setting'
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //由于获取授权是异步的，所以这里需同步一下
    this.setData({
      isAuthorized: app.globalData.isAuthorized,
      canuse: app.globalData.canuse
    })
  }
})