import axios from 'axios'
import { baseUrl} from '@/config/envconfig'
import localforage from 'localforage'
import { message } from 'antd';
/**
 * @params method {string} 方法名
 * @params url {string} 请求地址  例如：/login 配合baseURL组成完整请求地址
 * @params baseURL {string} 请求地址统一前缀 ***需要提前指定***  例如：http://cangdu.org
 * @params timeout {number} 请求超时时间 默认 30000
 * @params params {object}  get方式传参key值
 * @params headers {string} 指定请求头信息
 * @params withCredentials {boolean} 请求是否携带本地cookies信息默认开启
 * @params validateStatus {func} 默认判断请求成功的范围 200 - 300
 * @return {Promise}
 * 其他更多拓展参看axios文档后 自行拓展
 * 注意：params中的数据会覆盖method url 参数，所以如果指定了这2个参数则不需要在params中带入
*/
export default class Server{
  axios(method, url, data){
    return new Promise((resolve, reject) => {
      localforage.getItem('user').then((user) => { 
        if (user) {
          url = `${url}?account_id=${user.account_id}&token=${user.token}&platform=pc`
        } else {
          url = `${url}?platform=pc`
        }
        let _option = {
          method,
          url,
          baseURL: baseUrl,
          timeout: 30000,
          params: method === 'get' && data,
          data: method === 'post' && data,
          // headers:{'Content-Type':'application/x-www-form-urlencoded'},
          withCredentials: false,  //是否携带cookie发起请求
          validateStatus: (status)=> {
            return status >= 200 && status < 300
          },
        }
        axios.request(_option).then(res => {
            console.log(res)
            if (res.data.result === 1000) {
              localStorage.removeItem('user')
              localforage.clear().then((res) => {
                window.location.href='/login'
              })
            }
            if (res.data.result === 0) {
              message.error(res.data.msg);
            }
          resolve(typeof res.data === 'object'? res.data:JSON.parse(res.data))
        },error =>{
          if (error.response) {
            reject(error.response.data)
          } else{
            reject(error)
          }
        })
      })
    })
  }
}