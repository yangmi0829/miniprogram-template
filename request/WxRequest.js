import Interceptors from './interceptors'
import logger from './slf4j'

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
                'header': {}
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
                    logger.error("调用__handleReqCompleteInterceptors异常:", e)
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
                                        logger.error("调用__handleRespCompleteInterceptors异常:", e)
                                    }finally {
                                        resolve(r)
                                    }
                                })
                                .catch(err => {
                                    try {
                                        __this.interceptors.__handleRespCompleteInterceptors(err)
                                    }catch (e) {
                                        logger.error("调用__handleRespCompleteInterceptors异常:", e)
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
                  logger.error("调用__handleReqCompleteInterceptors异常:", e)
              }
          })
        })
      }
      this.addMethods(key, fn)
    }

    addMethods(key,methods){
        if(this[key]){
            logger.error('此方法已存在!',key)
            return
        }
        this[key] = methods
    }

    __initInterceptors(){
        this.interceptors = new Interceptors
    }

    __request(url,config){
        const __this = this
        const { baseURL } = config
        config = Object.assign({}, config, {url})
        return this.interceptors.__handleReqInterceptors(config)
          .then(result => {
              try {
                  __this.interceptors.__handleReqCompleteInterceptors(result)
              }catch (e) {
                  logger.error("调用__handleReqCompleteInterceptors异常:", e)
              }finally {
                  return new Promise((resolve, reject) => {
                      wx.request({
                          ...result,
                          url: baseURL + url,
                          success(res) {
                            res.config = config
                              try {
                                  __this.interceptors.__handleRespInterceptors(res)
                                      .then(res => {
                                          try {
                                              __this.interceptors.__handleRespCompleteInterceptors(res)
                                          }catch (e) {
                                              logger.error("调用__handleRespCompleteInterceptors异常:", e)
                                          }finally {
                                              resolve(res)
                                          }

                                      })
                                      .catch(e => {
                                          try {
                                              __this.interceptors.__handleRespCompleteInterceptors(e)
                                          }catch (e) {
                                              logger.error("调用__handleRespCompleteInterceptors异常:", e)
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
          })
    }
}

module.exports = WxRequest
