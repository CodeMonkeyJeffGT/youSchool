import { Alert } from 'react-native';

const loading = () => {
  
}

const success = () => {

}

const wrong = (code, msg) => {
  Alert.alert('提示(' + code + '):', msg);
}

const error = (msg = '发生未知错误') => {
  Alert.alert('系统发生错误', msg);
}

const alert = (msg) => {
  Alert.alert('提示', msg);
}

export default {
  loading,
  success,
  wrong,
  error,
  alert,
}