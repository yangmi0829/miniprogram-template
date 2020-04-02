// pages/password-input/password-input.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    password:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.passwordBox = this.selectComponent('#passwordBox')
  },
  showPopup() {
    this.setData({ show: true });
  },

  onClose() {
    this.setData({ show: false });
    this.clearPassword()
  },
  // 设置密码

  setupPasswordComplete(event) {

    console.log('setupPasswordComplete', event.detail)

    this.setData({ 'password': event.detail })
    this.onClose()
  },

  // 清除密码

  clearPassword() {
    this.passwordBox.clearCurrentValue() // 调用组件内部的清除方法，清空输入的值
  },
})
