// component/login/login.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    getphonenumber: function (e) {
      const { encryptedData, iv } = e.detail
      if (encryptedData && iv){
        this.triggerEvent('login', e.detail)
      }
    }
  }
})
