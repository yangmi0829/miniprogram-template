import API from '../../api/index'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  send(){
    API.test('https://www.baidu.com/')
        .then(res => {
          this.setData({
            content:res
          })
        })
  }
})
