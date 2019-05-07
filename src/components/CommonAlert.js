import { Alert } from 'react-native';

const loading = () => {
  
}

const success = () => {

}

const wrong = (code, msg) => {
  console.log(msg);
  Alert.alert('提示(' + code + '):', msg);
}

const error = (msg = '发生未知错误') => {
  console.log(msg);
  Alert.alert('系统发生错误', msg);
}

const alert = (title, msg) => {
  console.log(msg);
  Alert.alert(title, msg);
}

export default {
  loading,
  success,
  wrong,
  error,
  alert,
}