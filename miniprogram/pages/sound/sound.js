const recorderManager = wx.getRecorderManager();
const innerAudio = wx.createInnerAudioContext("audio");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    record: {
      text: "长按录音",
      type: "primary",
    }, //与录音相关的数据结构  
    startPoint: {}, //记录长按录音开始点信息,用于后面计算滑动距离。
    audioList: [],
    sendLock: true, //发送锁，当为true时上锁，false时解锁发送
    audioCount: 0
  },
// 开始录音
  handleRecordStart(e) {
    //longpress时触发
    this.startPoint = e.touches[0];//记录长按时开始点信息，后面用于计算上划取消时手指滑动的距离。
    const record = {//修改录音数据结构，此时录音按钮样式会发生变化。
      text: "松开发送",
      type: "default",
    };
    this.setData({
      record
    })
    recorderManager.start();//开始录音
    wx.showToast({
      title: "正在录音，上划取消发送",
      icon: "none",
      duration: 60000//先定义个60秒，后面可以手动调用wx.hideToast()隐藏
    });
    this.sendLock = false;//长按时是不上锁的。
  },
// 取消发送
  handleTouchMove(e) {
    //touchmove时触发
    var moveLenght = e.touches[e.touches.length - 1].clientY - this.startPoint.clientY; //移动距离
    if (Math.abs(moveLenght) > 50) {
      wx.showToast({
        title: "松开手指,取消发送",
        icon: "none",
        duration: 60000
      });
      this.sendLock = true;//触发了上滑取消发送，上锁
    } else {
      wx.showToast({
        title: "正在录音，上划取消发送",
        icon: "none",
        duration: 60000
      });
      this.sendLock = false;//上划距离不足，依然可以发送，不上锁
    }
  },
// 结束发送
  handleRecordStop() {
    // touchend(手指松开)时触发
    const record = {//修改录音数据结构，此时录音按钮样式会发生变化。
      text: "长按录音",
      type: "primary",
    };
    this.setData({
      record
    })
    wx.hideToast();//结束录音、隐藏Toast提示框
    recorderManager.stop();//结束录音
  },
  // 创建播放器
  createAudio(res) {
    const audioId = 'audio' + this.data.audioCount
    this.data.audioCount += 1;
    const duration = Math.floor(res.duration/1000)
    this.updateAudios(audioId,res.tempFilePath,duration)
  },
  // 更新播放列表
  updateAudios(id,src,duration) {
    this.data.audioList = [...this.data.audioList,{id,src,duration}]
    this.setData({
      audioList: this.data.audioList
    })
  },

  // 播放
  playAudio(event){
    console.log(event);
    const SRC = event.currentTarget.dataset.src;
    innerAudio.src = SRC;
    innerAudio.play()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    recorderManager.onStop(res => {
      if (this.sendLock) {
        //上锁不发送
      } else {//解锁发送，发送网络请求
        if (res.duration < 1000)
          wx.showToast({
            title: "录音时间太短",
            icon: "none",
            duration: 1000
          });
        else 
          this.createAudio(res)
        }
    });
  },

})