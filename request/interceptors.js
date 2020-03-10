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
            success(data){return data},
            error(error){return error},
            complete(data) { return data},
        }
    }

    __handleReqInterceptors(config){
        return this.__handleInterceptors('request', config)
    }

    __handleRespInterceptors(response){
      return this.__handleInterceptors('response', response)
    }

    __handleInterceptors(key, data){
      const __this = this
      return new Promise((resolve, reject) => {
        if (__this[key].success) {
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
