import {formatTime} from '../../utils/time'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initList()
  },
  initList(){
    const date = new Date()
    const arr = [
        'yyyy-MM-dd',
        'yyyy-MM-dd HH:mm:ss',
        'yyyy-MM-dd EE',
        'yyyy-MM-dd qq',
    ]
    const list = arr.map(item => ({
      fmt:item,
      value:formatTime(date,item)
    }))
    this.setData({
      list
    })
  }
})
