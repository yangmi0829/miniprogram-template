import WxRequest from './WxRequest'
import {baseURL} from '../environment/config'
import {RESPONCE_CODE_ENUM} from '../constants/responceCode'

const request = WxRequest.create({
  baseURL
})

let error = null
// 请求拦截器
request.interceptors.request = {
    success(config){
        // todo 请求头携带token
        config.header.token = 'token'
      return Promise.resolve(config)
    },
    error(e){
        return Promise.reject(e)
    },
    complete(e) {
      wx.showLoading()
    },
}
// 响应拦截器
request.interceptors.response = {
    success(response){
        if( response.statusCode == 200 && response.data.code == RESPONCE_CODE_ENUM.SUCCESS){
          return Promise.resolve(response.data)
        }
      return Promise.reject(response.data)
    },
    error(e){
        error = e
    },
    complete(e){
        wx.hideLoading()
        error && wx.showToast({
            title: error,
            icon: 'none',
        })
    }
}


/*request({
    url: 'https://www.baidu.com'
}).then(res => {
    console.log('then', res)
}).catch(e => {
    console.warn('catch',e)
})
request.get('https://www.baidu.com')
    .then(res => {
        console.log('then', res)
    }).catch(e => {
    console.warn('catch',e)
})*/
module.exports = request
