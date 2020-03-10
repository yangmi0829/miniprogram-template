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
            .then(options => {
                try {
                    __this.interceptors.__handleReqCompleteInterceptors(options)
                }catch (e) {
                    console.error("调用__handleReqCompleteInterceptors异常:", e)
                }finally {
                    wx.uploadFile({
                        ...options,
                        success(res) {
                            res = { ...res, data: JSON.parse(res.data) }
                            __this.interceptors.__handleRespInterceptors(res)
                                .then(r => {
                                    try {
                                        __this.interceptors.__handleRespCompleteInterceptors(r)
                                    }catch (e) {
                                        console.error("调用__handleRespCompleteInterceptors异常:", e)
                                    }finally {
                                        resolve(r)
                                    }
                                })
                                .catch(err => {
                                    try {
                                        __this.interceptors.__handleRespCompleteInterceptors(err)
                                    }catch (e) {
                                        console.error("调用__handleRespCompleteInterceptors异常:", e)
                                    }finally {
                                        reject(err)
                                    }
                                })
                        },
                        fail(e) {
                            reject(e)
                        }
                    })
                }


            }).catch(e => {
              try {
                  __this.interceptors.__handleReqCompleteInterceptors(e)
              }catch (e) {
                  console.error("调用__handleReqCompleteInterceptors异常:", e)
              }
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
        const __this = this
        const { baseURL } = config
        config = Object.assign({}, config, { url: baseURL + url })
        return this.interceptors.__handleReqInterceptors(config)
          .then(result => {
              try {
                  __this.interceptors.__handleReqCompleteInterceptors(result)
              }catch (e) {
                  console.error("调用__handleReqCompleteInterceptors异常:", e)
              }finally {
                  return new Promise((resolve, reject) => {
                      wx.request({
                          ...result,
                          success(res) {
                              try {
                                  __this.interceptors.__handleRespInterceptors(res)
                                      .then(res => {
                                          try {
                                              __this.interceptors.__handleRespCompleteInterceptors(res)
                                          }catch (e) {
                                              console.error("调用__handleRespCompleteInterceptors异常:", e)
                                          }finally {
                                              resolve(res)
                                          }

                                      })
                                      .catch(e => {
                                          try {
                                              __this.interceptors.__handleRespCompleteInterceptors(e)
                                          }catch (e) {
                                              console.error("调用__handleRespCompleteInterceptors异常:", e)
                                          }finally {
                                              reject(e)
                                          }
                                      })
                              } catch (e) {
                                  reject(e)
                              }
                          },
                          fail(e) { reject(e) },
                      })
                  })
              }
          }).catch(err => {
                try {
                    __this.interceptors.__handleReqCompleteInterceptors(err)
                }catch (e) {
                    console.error("调用__handleReqCompleteInterceptors异常:", e)
                }finally {
                    return Promise.reject(err);
                }
          })
    }
}

module.exports = WxRequest
