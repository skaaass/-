var plugin = requirePlugin("WechatSI")
let manager = plugin.getRecordRecognitionManager()
Page({
 /**
   * 页面的初始数据
   */
  data: {
    t:'',
    currentText: '',
    translateText: '',
  },
  navigate: function () {
    wx.navigateTo({
      url: '../wifi_station/tianqi/tianqi',
    })
  },
    streamRecord: function () {
    manager.start({
      lang: 'zh_CN',
    })
  },
  endStreamRecord: function () {
    manager.stop()
  },
  onLoad: function () {
    this.initRecord()
  },
  initRecord: function () {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = (res) => {
      let text = res.result
      this.setData({
        currentText: text,
      })
    }
    // 识别结束事件
    manager.onStop = (res) => {
      let text = res.result
      if (text == '') {
        // 用户没有说话，可以做一下提示处理...
        return
      }
      this.setData({
        currentText: text,
      })
      // 得到完整识别内容就可以去翻译了
      this.translateTextAction()
    }
  },
  translateTextAction: function () {
    let lfrom = 'zh_CN'
    let lto = 'en_US'
    plugin.translate({
      lfrom: lfrom,
      lto: lto,
      content: this.data.currentText,
      tts: true, // 需要合成语音
      success: (resTrans) => {
        // 翻译可以得到 翻译文本，翻译文本的合成语音，合成语音的过期时间
        let text = resTrans.result
        this.setData({
          translateText: text,
        })
        // 得到合成语音让它自动播放出来
        wx.playBackgroundAudio({
          dataUrl: resTrans.filename,
          title: '',
        })
      },
    })
  },
  //调用onenetapi
  openclock2: function () {
 var moi=this.data.translateText
    wx.request({
      method: 'POST',
      url: 'http://api.heclouds.com/devices/562202523/datapoints?datastream_id=666',
      header: {
        'api-key': 'gj73vG5V9sVaGK3FFHXmAdaYElw='
      },
      data: {
        "datastreams": [{
          "id": "666",
          "datapoints": [{
            "at": "",
            "value": "ss",
          }]
        }]
      },
      success: function (res) {
          wx.showToast({
            title: '开启成功',
            icon: 'success',
            duration: 2000
          })
         console.log(moi)
      },
      fail: function (res) {
        console.log("fail!!!")
        wx.showToast({
          title: '开启失败',
          icon: 'fail',
          duration: 2000
        })
      },
    })
  },
})