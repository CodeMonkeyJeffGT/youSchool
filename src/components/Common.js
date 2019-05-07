import CommonAlert from './CommonAlert'
import Store from './Store'

const checkSign = () => {
  return new Promise(
    (resolve, reject) => {
      Store.get('signature')
      .then(
        (signature) => {
          if ( signature == null ) {
              reject();
          }
          resolve();
        }
      )
      .catch(
        (error) => {
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

const goBack = (obj) => {
  obj.props.navigation.goBack(null);
}

export default {
    checkSign,
    toSign,
    toRoute,
    goBack,
}