import WxRequest from './WxRequest'
import {baseURL} from '../environment/config'
import {RESPONCE_CODE_ENUM} from '../constants/responceCode'
const request = new WxRequest({
    baseURL
})
// 请求拦截器
request.interceptors.request = {
    success(config){
        // todo 请求头携带token
      return Promise.resolve(config)
    },
    error(e){
        return Promise.reject(e)
    }
}
// 响应拦截器
request.interceptors.response = {
    success(response){  
        if( response.statusCode == 200 && response.data.code == RESPONCE_CODE_ENUM.SUCCESS){
          return Promise.resolve(response.data)
        }
      return Promise.reject(response.data)
    },
    error(e){}
}

module.exports = request
