// 全局配置

let baseUrl = ''
let imgUrl
if (process.env.NODE_ENV === 'development'){
  baseUrl = 'https://devwww.nongline.cn/'
  imgUrl = '//elm.cangdu.org/img/'
} else if (process.env.NODE_ENV === 'production') {
  baseUrl = 'http://api.nongline.com'
  imgUrl = '//elm.cangdu.org/img/'
}

export {
  baseUrl,
  imgUrl
}

