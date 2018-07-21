// pages/linger/olive/olive.js
const util=require('../../../utils/util.js');
const app=getApp();
Page({
  data: {
    olives:[],
    user_id:'',
    errSee:false,
    myError:{}
  },
  errHandler:function(){
    this.fetchOlives();
  },
  turnToOliveEditPage:function(e){
    console.log('e:'+JSON.stringify(e));
    var dataset=e.currentTarget.dataset;
    var item=dataset.item;
    var olive_id=item._id;
    var oliveContent=item.content;
    wx.navigateTo({
      url: './olive_edit/olive_edit?olive_id=' +olive_id+'&content='+oliveContent
    })
  },
  deleteOlive:function(e){

  },

  del:function(){
    var _this = this;
    var dataset = e.currentTarget.dataset;
    var item = dataset.item;
    var olive_id = item._id;
    wx.myRequest({
      url: app.globalData.domain + '/deleteOlive',
      data: { olive_id: olive_id },
      method: 'POST',
      success: function (res) {
        var r = res.data;
        if (r.code === 0) {
          _this.setData({
            olives: r.data
          })
        } else if (r.code === 1) {
          wx.showToast({
            title: '响应失败',
            icon: 'none'
          })
        }
      },
      fail: function () {
        wx.showToast({
          title: '响应失败',
          icon: 'none'
        })
      }
    })
  },
  fetchOlives:function(){
    this.setData({
      errSee: false
    })
    var _this=this;
    wx.myRequest({
      url: app.globalData.domain +'/getOlives',
      data:{
        user_id:this.data.user_id
      },
      method:'POST',
      success:function(res){
        var r=res.data;
        if(r.code===0){
          if(r.data.length===0){
            _this.setData({
              errSee:true,
              myError: util.errMsg.empty
            })
            return;
          }
          r.data = util.jokesConvertTime(r.data);
          _this.setData({
            errSee:false,
            olives:r.data
          })
        }else if(r.code===1){
          _this.setData({
            errSee: true,
            myError: util.errMsg.error
          })
        } 
      },
      fail:function(){
        _this.setData({
          errSee: true,
          myError: util.errMsg.error
        })
      }
    })
  },
  turnToOliveAddPage:function(){
    wx.navigateTo({
      url: 'olive_add/olive_add',
    })
  },
  onLoad: function (options) {

  },
  onReady: function () {
  
  },
  onShow: function () {
    this.setData({
      user_id: app.globalData.userInfo._id
    })
    this.fetchOlives();
    util.setNavigationBarColor();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.fetchOlives();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})