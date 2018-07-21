// pages/linger/talk/talk.js
/**
 * bug:<hr>,输入框
 * 聊天界面：通过请求图灵机器人API接口实现
 */
const util=require('../../../utils/util.js');
var app = getApp();
Page({
  data: {
    value:'',
    talk: [],
    navigateBarColor: util.getNavigationBarColor()
  },
  obj:{},
  yourTalk: function() {
    var _this=this;
    var params={
      "perception": {
        "inputText": {
          "text":'-_-'
        },
        "selfInfo": {
          "location": {
            "city": app.globalData.userInfo.city,
            "province": app.globalData.userInfo.province
          }
        }
      },
      "userInfo": {
        "apiKey": app.globalData.talkInfo.apiKey,
        "userId": '123456'
      }
    };
    var setYourTalk = function (v) {
      _this.data.talk.push({
        roleType: 0,
        iconPath: './tuling.png',
        values: {
          text: v
        }
      });
      _this.setData({
        value:'',
        talk: _this.data.talk
      })
    };
    var updateYourTalk=function(){
      var _this=this;
      wx.request({
        url: app.globalData.domain+'/talk',
        data: {
          text: _this.obj.yourTalk.params.perception.inputText.text
        },
        method: 'POST',
        success: function (res) {
          var r=res.data;
          console.log(JSON.stringify(r));
          if(r.code===0){
            var value = r.data.results[0].values.text;
            setYourTalk.call(_this, value);
            _this.relativeTextareaValue.apply(_this);
          }else if(r.code===1){
            wx.showToast({
              title: '服务器内部出错',
              icon: 'fail',
              duration: 3000
            })
          }
        },
        fail: function () {
          wx.showToast({
            title: '连接服务器出错',
            icon: 'fail',
            duration: 3000
          })
        }
      })
    };
    return{
      params: params,
      setYourTalk: setYourTalk,
      updateYourTalk: updateYourTalk
    }
  },
  myTalk: function() {
    var _this = this;
    var setMyTalk = function() {
      _this.data.talk.push({
        roleType: 1,
        iconPath: app.globalData.userInfo.avatarUrl,
        values: {
          text: _this.obj.yourTalk.params.perception.inputText.text
        }
      });
      _this.setData({
        talk: _this.data.talk
      })
    }
    return {
      setMyTalk: setMyTalk
    }
  },
  session: function(){
    var _this=this;
    var start=function(){
      var myTalk=_this.obj.myTalk;
      var yourTalk=_this.obj.yourTalk;
      myTalk.setMyTalk.apply(_this);
      yourTalk.updateYourTalk.apply(_this);
    };
    return{
      start:start
    }
  },
  relativeTextareaValue: function(e) {
    if (!e) {
      this.obj.yourTalk.params.perception.inputText.text = '-_-';
      return;
    }
    if (e.detail.value == '') {
      this.obj.yourTalk.params.perception.inputText.text = '-_-';
      return;
    }
    this.obj.yourTalk.params.perception.inputText.text = e.detail.value;
  },

  //obj对象用来管理其他对象
  onLoad: function(options) {
    this.obj.myTalk=this.myTalk();
    this.obj.yourTalk=this.yourTalk();
    this.obj.session=this.session();
  },
  onShow:function(){
    util.setNavigationBarColor();
    this.setData({
      navigateBarColor: util.getNavigationBarColor()
    })
  },
  start:function(){
    this.obj.session.start.apply(this);
  }
})