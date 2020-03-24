// pages/rich-text/rich-text.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    html: '<div style="color:red;">Hello World!</div> <a href="https:www.baidu.com">www.baidu.com</a><img src="https://www.baidu.com/img/bd_logo1.png?qua=high"></img>'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  handleInput(e){
    this.data.html = e.detail.value
  },
  parser(){
    this.setData({
      html: this.data.html
    })
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