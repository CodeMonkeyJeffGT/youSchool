import React from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
} from 'react-native';

import { AppLoading, Icon } from 'expo';
import Colors from '../constants/Colors';

import Common from '../components/Common';
import Ajax from '../components/Ajax';
import Uri from '../constants/Uri';
import CommonAlert from '../components/CommonAlert';
import Store from '../components/Store'

export default class FollowColumnsScreen extends React.Component {

  state = {
    isLoadingComplete: false,
    isLogin: false,
    users: [],
  }

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: '我关注的版块',
  };

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <FlatList 
            data={this.state.columns}
            keyExtractor={item => 'forumColumns' + item.id + ''}
            renderItem={({item}) => 
              <TouchableOpacity onPress={this.columnDetail.bind(this, item.id)} style={styles.columnElement}>
                <Text style={styles.columnName}>{item.name} {item.type}</Text>
                <Text style={styles.columnDesc}>{item.description}</Text>
                <Text style={styles.columnLike}>关注：{item.followNum}人</Text>
              </TouchableOpacity>
            }
          />
        </ScrollView>
      </View>
    );
  }

  follows() {
    this.sendAjax('columnFollowList', [], {}, (rst) => {
      let types = ['[学校V]', '[热门V]', ''];
      for(var key in rst) {
        rst[key].type = types[rst[key].type];
      }
      this.setState({ columns: rst, isLoadingComplete: true });
    }, (error) => {
      CommonAlert.alert('错误', '获取关注列表失败');
    });
  }

  checkSign = () => {
    if ( ! this.state.isLogin) {
      Common.checkSign()
      .then(
        (rst) => {
          this.setState({ isLogin : true });
        }
      )
      .catch(
        (error) => {
          Common.toSign(this);
          throw error;
        }
      );
    }
  }

  columnDetail = (id) => {
    this._goto('Columns', {id: id});
  }

  _goto = (route, params = {}) => {
    if ( ! this.state.isLogin) {
      Common.checkSign()
      .then(
        (rst) => {
          this.setState({ isLogin : true });
          this.gotoReal(route, params);
        }
      )
      .catch(
        (error) => {
          Common.toSign(this);
          this.setState({ isLogin : false });
          throw error;
        }
      );
    }
    this.gotoReal(route, params);
  }
  
  gotoReal = (route, params = {}) => {
    Common.toRoute(this, route, params);
  }

  sendAjax = (uriName, replaces, datas, success, errorFun) => {
    if ( ! this.state.isLogin) {
      Common.checkSign()
      .then(
        (rst) => {
          this.setState({ isLogin : true });
          this.ajaxReal(uriName, replaces, datas, success, errorFun);
        }
      )
      .catch(
        (error) => {
          throw error;
        }
      );
    }
    this.ajaxReal(uriName, replaces, datas, success, errorFun);
  }

  ajaxReal = (uriName, replaces, datas, successFun, errorFun) => {
    let uri = Uri[uriName].uri;
    for(var key in replaces) {
      uri = uri.replace('{' + key + '}', replaces[key]);
    }
    Ajax.send(Uri[uriName].method, uri, datas)
    .then((rst) => {
      successFun(rst);
    })
    .catch((error) => {
      errorFun(error);
    });
  }

  _loadResourcesAsync = () => {
    this.props.navigation.addListener(
      'willFocus',
      payload => {
        this.setState({
          isLoadingComplete: false,
          follows: 0,
          followed: 0,
          userDone: false,
          numberDone: false,
        });
      }
    );
    Common.checkSign()
    .then(
      (rst) => {
        this.setState({ isLogin : true });
        this.follows();
      }
    )
    .catch(
      (error) => {
        Common.toSign(this);
        throw error;
      }
    );
  }

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
  };

  signOutUser = () => {
    Store.unset('signature')
    .then(
      () => {
        this.setState({ isLoadingComplete: false, isLogin: false });
      }
    )
  }
}

const styles = StyleSheet.create({
  axis: {
    borderLeftWidth: 1,
    borderColor: Colors.accent,
  },
  followNumber: {
    width: (Dimensions.get('window').width- 111) / 2,
  },
  buttonIcon: {
    width: 40,
    alignItems: 'center',
  },
  buttonText: {
    justifyContent: 'center',
    paddingLeft: 20,
  },
  element: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: Colors.dividerColor,
  },
  elementEnd: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  welcomeContainer: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  userContainer: {
    paddingHorizontal: 15,
    paddingTop: 15,
    paddingBottom: 15,
    flexDirection: 'row',
    backgroundColor: Colors.dividerColor,
    marginBottom: 5,
  },
  userIconContainer: {
    marginRight: 15,
    paddingTop: 2,
  },
  nameText: {
    fontWeight: '600',
    fontSize: 18,
  },
  slugText: {
    color: '#a39f9f',
    fontSize: 14,
    backgroundColor: 'transparent',
  },
  descriptionText: {
    fontSize: 14,
    marginTop: 6,
    color: '#4d4d4d',
  },
  columnElement: {
    padding: 5,
  },
  columnName: {
    fontSize: 20,
  },
  columnDesc: {
    fontSize: 10,
  },
  columnLike: {
    fontSize: 12,
    textAlign: 'right',
  },
});
