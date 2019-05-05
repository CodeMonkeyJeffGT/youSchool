import { Alert } from 'react-native';

const loading = () => {
  
}

const success = () => {

}

const wrong = () => {

}

const error = (msg = '发生未知错误') => {
  Alert.alert('提示', msg);
}

export default {
  loading,
  success,
  wrong,
  error,
}