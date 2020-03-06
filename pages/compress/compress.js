import {getCompressImgPath} from '../../utils/compress'
Page({

  /**
   * 页面的初始数据
   */
  data: {
      src: null,
      width:0,
      height:0,
    sourceSize:0,
    compressSize:0,
  },
  upload(){
    var that = this;
    wx.chooseImage({
      success: result => {
        console.log('原图大小', result.tempFiles[0].size)
        this.setData({
          sourceSize: result.tempFiles[0].size
        })
        getCompressImgPath(result.tempFilePaths[0], {}, that)
          .then(path => {
            that.setData({
              src: path
            })
            wx.getFileInfo({
              filePath: path,
              success(res) {
                console.log('压缩后图片大小:', res.size)
                that.setData({
                  compressSize: res.size
                })
              }
            })
          })
      }
    })
  },
})
