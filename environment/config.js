// 环境
const env = 'pro'

const urlMap = new Map()

switch (env) {
    case 'dev':
        urlMap.set('baseURL', '')
        break;
    case 'pro':
        urlMap.set('baseURL', '')
        break
}

module.exports = {
    baseURL: urlMap.get('baseURL')
}

