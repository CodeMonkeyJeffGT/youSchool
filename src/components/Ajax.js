import axios from 'axios'
import CommonAlert from './CommonAlert'

// //请求拦截器
// axios.interceptors.request.use(
//   function(config) {
//     // 添加响应头等等设置
//     config.headers.userToken = 'this is my token'
//     return config
//   },
//   function(error) {
//     return Promise.reject(error) // 请求出错
//   }
// )

//返回拦截器
axios.interceptors.response.use(
  function(response) {
    if (response.data.code == 1) {
      CommonAlert.error('请登录');
      this.props.navigation.navigate('Sign');
      return Promise.reject('请登录');
    }
    if (response.data.code != 0) {
      let code = response.data.code;
      let message = response.data.message;
      CommonAlert.wrong(code, message);
      return Promise.reject(message);
    } else {
      return response.data;
    }
  },
  function(error) {
    console.warn(error);
    CommonAlert.error('请求失败');
    return Promise.reject(error);
  }
)

const baseURL = 'http://192.168.1.103/';
const defaultData = {};
const defatltUrl = '/';
const send = (method = 'GET', url = defatltUrl, data = defaultData) => {
  Store.load('signature')
  .then(
    (signature) => {
      return axios({
        method: method,
        url,
        data,
        baseUrl: baseURL,
        headers: {
          'signature': signature
        },
      })
    }
  )
  .catch(
    (error) => {
      console.warn(error);
      CommonAlert.error('请求失败');
      return Promise.reject(error);
    }
  )
};

export default {
  send,
}
