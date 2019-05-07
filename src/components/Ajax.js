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
    console.log(response.data);
    if (response.data.code == 1) {
      Store.set('signature', null);
      CommonAlert.error('请登录');
      this.props.navigation.navigate('Sign');
      console.log('请登录');
      return Promise.reject('请登录');
    }
    if (response.data.code != 0) {
      let code = response.data.code;
      let message = response.data.message;
      CommonAlert.wrong(code, message);
      console.log(message);
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

const baseUrl = 'http://192.168.43.189/';
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
