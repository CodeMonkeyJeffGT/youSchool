import { AsyncStorage } from "react-native"
import CommonAlert from './CommonAlert'

const get = (key) => {
  return new Promise(
    (resolve, reject) => {
      let value;
      try {
        value = AsyncStorage.getItem(key);
      } catch (error) {
        CommonAlert.error('数据读取失败，可能会产生未知影响');
        reject(error);
      }
      resolve(value);
    }
  );
}

const set = async (key, value) => {
  return new Promise(
    (resolve, reject) => {
      try {
        AsyncStorage.setItem(key, value);
      } catch (error) {
        CommonAlert.error('数据存储失败，可能会产生未知影响');
        reject(error);
      }
      resolve();
    }
  );
}

const unset = async (key) => {
  return new Promise(
    (resolve, reject) => {
      try {
        AsyncStorage.removeItem(key);
      } catch (error) {
        CommonAlert.error('数据删除失败，可能会产生未知影响');
        reject(error);
      }
      resolve();
    }
  );
}

export default {
    get,
    set,
    unset,
}