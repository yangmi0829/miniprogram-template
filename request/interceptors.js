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
        }
    }

    __handleReqInterceptors(config){
        return this.__handleInterceptors('request', config)
    }

    __handleRespInterceptors(response){
        return this.__handleInterceptors('response', response)
    }

    __handleInterceptors(key, data){
        if(this[key].success){
            try {
                data = this[key].success(data)
            }catch (e) {
                this[key].error(e)
                throw new Error(e)
            }
        }
        return data
    }
}

module.exports = Interceptors
