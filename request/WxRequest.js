import Interceptors from './interceptors'
class WxRequest {
    constructor(options){
        this.options = options
        this.__init()
    }

    __init(){
        // 初始化基本配置
        this.__initOptions()
        
        // 初始化拦截器
        this.__initInterceptors()

        // 初始化restful请求
        this.__initMethods()

        //初始化扩展方法: 上传
        this.__initUploadMethods()
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
                config = Object.assign({header: {}}, this.options, config,{method})
                return this.__request(url,config)
            }
        })
    }

    __initUploadMethods(){
      const __this = this
      const key = 'upload'
      const fn = (options) => {
        return new Promise((resolve,reject) => {
          const { baseURL } = __this.options
          const { url } = options
          options = Object.assign({ header: {} }, options, { url: baseURL + url })
          __this.interceptors.__handleReqInterceptors(options)
            .then(option => {
              wx.uploadFile({
                ...options,
                success(res) {
                  res = { ...res, data: JSON.parse(res.data) }
                  __this.interceptors.__handleRespInterceptors(res)
                    .then(r => {
                      resolve(r)
                    })
                    .catch(err => reject(err))
                },
                fail(e) {
                  reject(e)
                }
              })
            })
        })
      }
      this.addMethods(key, fn)
    }

    addMethods(key,methods){
      this[key] = methods
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
          }).catch(err => {
            return Promise.reject(err);
          })
        
    }

}

module.exports = WxRequest
