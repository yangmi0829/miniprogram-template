import WxRequest from './WxRequest'
const request = new WxRequest({
    baseURL: ''
})
// 请求拦截器
request.interceptors.request = {
    success(config){
        // todo token
        return config
    },
    error(e){
        console.log(e)
    }
}
// 响应拦截器
request.interceptors.response = {
    success(response){ return response.data},
    error(e){}
}

module.exports = request
