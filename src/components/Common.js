import CommonAlert from './CommonAlert'
import Store from './Store'

const checkSign = (obj) => {
  return new Promise(
    (resolve, reject) => {
      Store.get('signature', '')
      .then(
        (signature) => {
          if ( signature == null ) {
              // CommonAlert.error('请登录');
              reject();
          }
          resolve();
        }
      ).catch(
        (error) => {
          console.log(error);
          reject();
        }
      );
    }
  )
};

const toSign = (obj) => {
  toRoute(obj, 'Sign');
}

const toRoute = (obj, route, params = {}) => {
  obj.props.navigation.navigate(route, params);
}

export default {
    checkSign,
    toSign,
    toRoute,
}