import WxValidate from '../../utils/WxValidate'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorList: [],
    form: {
      name: '',
      mobile: '',
      idcard: ''
    },
    rules: {
      name: [{ required: true, message: '姓名不能为空'}],
      mobile: [{ type:'tel', message: '手机号不合法'}],
      idcard: [{ type:'idcard', message: '身份证不合法'}],
    },
    wxValidate: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.data.wxValidate = new WxValidate(this.data.rules)
  },
  handleInput(e){
    const {key} = e.currentTarget.dataset
    const {value} = e.detail
    this.data.form[key] = value
  },
  submit() {
    const res = this.data.wxValidate.checkForm(this.data.form)
    this.setData({
      errorList: res
    })
  }
})
