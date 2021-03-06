import request from '../request/request'

const __API = {
    getJsCode(){
        return new Promise((resolve, reject) => {
            wx.login({
                success(res){
                    resolve(res)
                },
                fail(e){
                    reject(e)
                }
            })
        })
    }
}
const API = {
    test(){
        return request.get('/test')
    },
    upload(filePath){
      const options = {
        url: '/upload',
        filePath,
        name: 'file'
      }
      return request.upload(options)
    },
    login(data){
        // return request.get('/login', data)
        return new Promise(resolve => {
            __API.getJsCode()
                .then(({code}) => {
                    resolve({...data,code })
                })
        })
    }
}

export default API
