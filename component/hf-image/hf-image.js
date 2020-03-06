Component({
  options: {
    styleIsolation: 'isolated'
  },
  externalClasses: ['customer-class'],
  /**
   * 组件的属性列表
   */
  properties: {
    "error-src": {
      type:String,
      value: './error.jpg'
    },
    src:{
      type: String
    },
    mode: {
      type: String,
      value: 'aspectFit'
    },
    webp: {
      type: Boolean,
      value: false
    },
    "lazy-load": {
      type: Boolean,
      value: true
    },
    "show-menu-by-longpress": {
      type: Boolean,
      value: false
    }
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
    binderror(e) {
      this.setData({
        src: this.data["error-src"]
      })
      this.triggerEvent("error", e)
    },
    bindload(e) {
      this.triggerEvent("load", e)
    }
  }
})
