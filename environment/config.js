// 环境
const env = 'dev'

const urlMap = new Map()

// todo 设置请求url
switch (env) {
    case 'dev':
    urlMap.set('baseURL', 'http://localhost:3000')
        break;
    case 'pro':
        urlMap.set('baseURL', '')
        break
}

module.exports = {
    baseURL: urlMap.get('baseURL')
}

