class Interceptors{
    constructor(){
        this.__initInterceptors()
    }

    __initInterceptors(){
        this.request = this.getDefaultInterceptors()
        this.response = this.getDefaultInterceptors()
    }

    getDefaultInterceptors(){
        return {
          success(data) { return Promise.resolve(data)},
          error(error) { return Promise.reject(error)},
          complete(data) { return Promise.resolve(data)},
        }
    }

    __handleReqInterceptors(config){
        return this.__handleInterceptors('request', config)
    }

    __handleRespInterceptors(response){
      return this.__handleInterceptors('response', response)
    }


    __handleReqErrorInterceptors(config){
        return this.__handleInterceptors('request', config, 'error')
    }

    __handleRespErrorInterceptors(response){
        return this.__handleInterceptors('response', response, 'error')
    }

    __handleReqCompleteInterceptors(config){
        return this.__handleInterceptors('request', config, 'complete')
    }

    __handleRespCompleteInterceptors(response){
        return this.__handleInterceptors('response', response, 'complete')
    }


    __handleInterceptors(key, data, type){
      const __this = this
      return new Promise((resolve, reject) => {
          if(type === 'complete'){
              resolve(__this[key].complete(data))
          }else if (__this[key].success) {
              __this[key].success(data)
                .then(res => {
                  resolve(res)
                })
                .catch(e => {
                  __this[key].error(e)
                  reject(e)
                })
        }else{
          resolve(data)
        }
      })
    }
}

module.exports = Interceptors
