let path = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },
  getUserInfo(e) {
    if(e.detail.errMsg == 'getUserProfile:ok') {
      const USERINFO = e.detail.userInfo;
      wx.setStorage({
        key: 'userInfo',
        data: USERINFO
      })
      wx.cloud.callFunction({
        name: "baseFunction",
        data: {
          type: "getOpenId"
        }
      }).then(res => {
        const OPENID = res.result.openid;
        wx.setStorage({
          key: "openid",
          data: OPENID
        })
      })
      wx.navigateTo({
        url: path,
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    path = options.path;
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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