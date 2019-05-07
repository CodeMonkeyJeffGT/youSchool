import { Alert } from 'react-native';

const isConsole = false;

const loading = () => {
  
}

const success = () => {

}

const wrong = (code, msg) => {
  isConsole ? console.log(msg) : null;
  Alert.alert('提示(' + code + '):', msg);
}

const error = (msg = '发生未知错误') => {
  isConsole ? console.log(msg) : null;
  Alert.alert('系统发生错误', msg);
}

const alert = (title, msg) => {
  isConsole ? console.log(msg) : null;
  Alert.alert(title, msg);
}

export default {
  loading,
  success,
  wrong,
  error,
  alert,
}