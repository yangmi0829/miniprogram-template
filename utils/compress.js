/**
 * 使用示例
 * chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      success: result => {
        console.log('原图大小', result.tempFiles[0].size)
          getCompressImgPath(result.tempFilePaths[0], {}, that)
            .then(path => {
              that.setData({
                src: path
              })
              wx.getFileInfo({
                filePath: path,
                success(res) {
                  console.log('压缩后图片大小:', res.size)
                }
              })
            })
      }
    })
  }
 */
function getCompressImgPath(src, options, context, canvasId = 'canvas' ) {
  const { quality, percent} = Object.assign({ quality: 0.8, percent:0.5}, options)
  return new Promise(resolve => {
    getImageInfo(src)
        .then(({ width, height }) => {
          context.setData({ width, height})
          const ctx = wx.createCanvasContext(canvasId);
          ctx.clearRect(0, 0, width, height);
          ctx.drawImage(src, 0, 0, width, height);
          ctx.draw(false, function () {
            wx.canvasToTempFilePath({
              canvasId: canvasId,
              fileType: 'jpg',
              quality: quality,
              destWidth: width * percent,
              destHeight: height * percent,
              success: function success(res) {
                resolve(res.tempFilePath)
              },
              fail: function (e) {
                console.error(e)
              },
              complete: function (e) {
                console.log(e)
              },
            });
          })
        })
  })
}
function getImageInfo(src){
  return new Promise(resolve => {
    wx.getImageInfo({
      src,
      success(res) {
        resolve(res)
      }
    })
  })
}
module.exports = {
  getCompressImgPath
}
