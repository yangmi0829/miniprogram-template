import Interceptors from './interceptors'
class WxRequest {
    constructor(options){
        this.options = options
        this.__init()
    }

    __init(){
        // 初始化基本配置
        this.__initOptions()
        // 初始化restful请求
        this.__initMethods()
        // 初始化拦截器
        this.__initInterceptors()
    }

    __initOptions(){
        const defaultOptions = {
            header: {
                'content-type': 'application/json',
                'method': 'GET',
                'dataType': 'json',
                'responseType': 'text',
                'timeout': 10 * 1000,
            }
        }
        this.options = Object.assign({}, defaultOptions, this.options)
    }

    __initMethods(){
        const methods = [
            'GET',
            'PUT',
            'POST',
            'DELETE',
        ]
        methods.forEach(method => {
            this[method.toLowerCase()] = (url,config) => {
                config = Object.assign({}, this.options, config,{method})
                return this.__request(url,config)
            }
        })
    }

    __initInterceptors(){
        this.interceptors = new Interceptors
    }

    __request(url,config){
        const _this = this
        const { baseURL } = config
        config = Object.assign({}, config, { url: baseURL + url })
        return this.interceptors.__handleReqInterceptors(config)
          .then(result => {
            return new Promise((resolve, reject) => {
              wx.request({
                ...result,
                success(res) {
                  try {
                    _this.interceptors.__handleRespInterceptors(res)
                      .then(res => {
                        resolve(res)
                      })
                      .catch(e => {
                        reject(e)
                      })
                  } catch (e) {
                    reject(e)
                  }
                },
                fail(e) { reject(e) },
              })
            })
          })
        
    }

}

module.exports = WxRequest
