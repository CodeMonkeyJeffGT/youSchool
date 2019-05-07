import axios from 'axios'
import CommonAlert from './CommonAlert'
import Store from './Store'

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
    let code = response.data.code;
    let message = response.data.message;
    if (response.data.code == 1) {
      Store.set('signature', null);
      CommonAlert.wrong(code, message);
      this.props.navigation.navigate('Sign');
      return Promise.reject(message);
    }
    if (response.data.code != 0) {
      CommonAlert.wrong(code, message);
      return Promise.reject(message);
    } else {
      return Promise.resolve(response.data);
    }
  },
  function(error) {
    console.warn(error);
    CommonAlert.error('网络请求失败');
    return Promise.reject(error);
  }
)

const baseUrl = 'http://you.nefuer.net/';
const defaultData = {};
const defatltUri = '/';
const send = (method = 'GET', uri = defatltUri, data = defaultData) => {
  return new Promise(
    (resolve, reject) => {
      Store.get('signature')
      .then(
        (signature) => {
          if (signature == null) {
            signature = '';
          }
          resolve(axios({
            method: method,
            url: uri,
            data: data,
            baseUrl: baseUrl,
            headers: {
              'signature': signature
            },
          }));
        }
      )
      .catch(
        (error) => {
          console.warn(error);
          CommonAlert.error('请求失败');
          reject(error);
        }
      )
    }
  );
};

export default {
  send,
}
