import Interceptors from './interceptors'
import logger from './slf4j'
import { buildFullPath } from './helper.js'

class WxRequest {
    constructor(options){
        this.options = options
        this.__init()
    }
    static create(options){
      const instance = new WxRequest(options)
      const fn = function (options) {
        return this.__request(options)
      }.bind(instance)
      fn.__proto__ = instance
      return fn
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
                config = Object.assign({header:{}, method, url}, this.options, config)
                return this.__request(config)
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
          options = Object.assign({ header: {} }, options)
          __this.interceptors.__handleReqInterceptors(options)
            .then(options => {
                try {
                    __this.interceptors.__handleReqCompleteInterceptors(options)
                }catch (e) {
                    logger.error("调用__handleReqCompleteInterceptors异常:", e)
                }finally {
                    wx.uploadFile({
                        ...options,
                        url: buildFullPath(baseURL, url),
                        success(res) {
                            res = { ...res, data: JSON.parse(res.data) }
                            res.config = options
                            __this.interceptors.__handleRespInterceptors(res)
                                .then(r => {
                                    resolve(r)
                                })
                        },
                        fail(e) {
                            __this.__handleFail.call(__this, e, reject)
                        },
                        complete(e){
                            __this.__handleComplete.call(__this, e, resolve)
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

    __handleFail(e, reject){
        try {
            this.interceptors.__handleReqErrorInterceptors(e)
        }catch (e) {
            logger.error("调用__handleRespErrorInterceptors异常:", e)
        }finally {
            reject(e)
        }
    }

    __handleComplete(e){
        wx.nextTick(_ => {
            try {
                this.interceptors.__handleRespCompleteInterceptors(e)
            }catch (e) {
                logger.error("调用__handleRespCompleteInterceptors异常:", e)
            }
        })
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

    __request(config){
        const __this = this
        const { baseURL, url } = config
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
                          url: buildFullPath(baseURL, url),
                          success(res) {
                              res.config = config
                              __this.interceptors.__handleRespInterceptors(res)
                                  .then(res => {resolve(res)})
                                  .catch(e => {reject(e)})
                          },
                          fail(e) {
                              __this.__handleFail.call(__this, e, reject)
                          },
                          complete(e){
                              __this.__handleComplete.call(__this, e, resolve)
                          }
                      })
                  })
              }
          })
    }
}

module.exports = WxRequest
