import { AsyncStorage } from "react-native"
import CommonAlert from './CommonAlert'

const get = (key) => {
  return new Promise(
    (resolve, reject) => {
      let value;
      try {
        value = AsyncStorage.getItem(key);
      } catch (error) {
        console.log(error);
        reject(error);
      }
      resolve(value);
    }
  );
}

const set = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.log(error);
    CommonAlert.error('存储失败，可能会产生未知影响');
  }
}

export default {
    get,
    set,
}