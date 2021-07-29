const openid = getApp().globalData.openid;
let start = 0;
let limit = 10;
let action = 'update';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    photos: [],
    isFinishd: false
  },

  // 更新本地数组
  updatePhotos(newPhotos) {
    switch (action) {
      case 'add':
        if(newPhotos.length){
          this.data.photos = [...this.data.photos,...newPhotos]
        } else {
          this.data.photos.push(newPhotos)
        }
        break;
      case 'update':
        this.data.photos = [...newPhotos];
        break;
      case 'del':
        this.data.photos = this.data.photos.filter(photo => !newPhotos.include(photo));
        break;
      default: console.log("参数错误");
    }
    this.setData({
      photos: this.data.photos
    })
    
  },
  // 添加图片
  addPhoto() {
    action = 'add'
    const that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original','compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        for(let tempFilePath of tempFilePaths) {
          that.fileTransCode(tempFilePath)
        }
      }
    })
  },
  // 文件转码
  fileTransCode(tempFilePath) {
    const that = this;
    wx.getFileSystemManager().readFile({
      filePath: tempFilePath,
      encoding: 'base64',
      success (res) {
        that.localToCloud(res.data)
      }
    })
  },
  // 上传文件到云存储
  localToCloud(tempFilePath) {
    const that = this;
    wx.cloud.callFunction({
      name: "photos",
      data: {
        type: "save",
        tempFilePath: tempFilePath
      }
    }).then(res => {
      console.log(res);
      that.updatePhotos(res.result)
    })
  },

  // 查询图片
  selectPhotos() {
    const that = this;
    wx.cloud.callFunction({
      name: 'photos',
      data: {
        type: 'select',
        openid,
        start,
        limit
      }
    }).then(res => {
      console.log(res);
      if(res.result.data.length<limit) {
        that.data.isFinishd = true;
      }
      start += limit;
      that.updatePhotos(res.result.data)
    })
  },

  // 预览图片
  preview(event){
    let currentUrl = event.currentTarget.dataset.src
    const urls = this.data.photos.map(val => val.fileID)
    wx.previewImage({
      current: currentUrl, // 当前显示图片的http链接
      urls // 需要预览的图片http链接列表
    })
  },
  // 删除图片
  delPhotos(event){
    const that = this
    let list = that.data.photos
    let index = event.currentTarget.dataset.index;
    wx.showModal({
      title: 'tip',
      content: '确定删除这张图片吗？',
      success: function(res) {
        if(res.confirm) {
          list.splice(index,1)
        } else {
          return false
        }
        that.setData({
          photos: list
        })
      }
    })
  },
      /**
       * 生命周期函数--监听页面加载
       */
      onLoad: function (options) {
        this.selectPhotos()
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
        start = 0;
        action = 'update';
        const that = this;

        wx.showNavigationBarLoading(); 
        wx.showLoading({
          title: '刷新中...',
        })
        wx.cloud.callFunction({
          name: 'photos',
          data: {
            type: 'select',
            openid,
            start,
            limit
          }
        }).then(res => {
          wx.hideLoading();
          //隐藏导航条加载动画
          wx.hideNavigationBarLoading();
          //停止下拉刷新
          wx.stopPullDownRefresh();
          that.updatePhotos(res.result.data)
        })
      },

      /**
       * 页面上拉触底事件的处理函数
       */
      onReachBottom: function () {
        if(!this.data.isFinishd) {
          action = 'add';
          this.selectPhotos()
        }
      },

      /**
       * 用户点击右上角分享
       */
      onShareAppMessage: function () {

      }
})