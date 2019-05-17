import React from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppLoading, Icon } from 'expo';
import Colors from '../constants/Colors';

import Common from '../components/Common';
import Ajax from '../components/Ajax';
import Uri from '../constants/Uri';
import CommonAlert from '../components/CommonAlert';
import Store from '../components/Store'

export default class ForumScreen extends React.Component {

  state = {
    isLoadingComplete: false,
    isLogin: false,
    user: {},
    buttons: [],
    follows: 0,
    followed: 0,
    userDone: false,
    numberDone: false,
    showEditInfo: false,
    sign: '',
  }

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: '我',
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
    if (this.state.showEditInfo) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              <View style={styles.editElement}>
              </View>
              <View style={styles.editElement}>
                <Text sytle={styles.editLabel}>
                  个性签名
                </Text>
                <TextInput
                  ref='desc'
                  style={styles.editInput} 
                  value={this.state.sign}
                  onChangeText={(text) => this.setState({ desc: text })}
                  onSubmitEditing={() => this.editInfo()}
                />
              </View>
              <View style={styles.editElement}>
                <TouchableOpacity
                  onPress={() => this.editInfo()}
                >
                  <Text style={styles.editButton}>修改</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.editElement}>
                <TouchableOpacity
                  onPress={() => this.setState({showEditInfo: false})}
                >
                  <Text style={styles.editButton}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <View style={styles.userContainer}>
              <View style={styles.userIconContainer}>
                <Image
                  source={{ uri: this.state.user.headpic == '' ? 'http://you.nefuer.net/imgs/default.png' : 'http://you.nefuer.net' + this.state.user.headpic }}
                  style={{ width: 64, height: 64, borderRadius: 50, }}
                  resizeMode="cover"
                />
              </View>
              <View style={styles.titleTextContainer}>
                <Text style={styles.nameText} numberOfLines={1}>
                  {this.state.user.nickname}
                </Text>
                <Text style={styles.slugText} numberOfLines={1}>
                  {this.state.user.school.name}
                </Text>
                <Text style={styles.descriptionText}>
                  {this.state.user.sign}
                </Text>
              </View>
            </View>
            <View style={styles.userContainer}>
              <TouchableOpacity style={styles.followNumber} onPress={this._goto.bind(this, 'Follows')}><Text style={{textAlign: 'center'}}>关注 {this.state.follows}</Text></TouchableOpacity>
              <View style={styles.axis}/>
              <TouchableOpacity style={styles.followNumber} onPress={this._goto.bind(this, 'Followed')}><Text style={{textAlign: 'center'}}>粉丝 {this.state.followed}</Text></TouchableOpacity>
            </View>
            <View style={{marginTop: 20}}>
              <FlatList 
                data={this.state.buttons}
                keyExtractor={item => 'meControl' + item.id + ''}
                renderItem={({item}) => 
                  <TouchableOpacity onPress={this._goto.bind(this, item.route)} style={styles.element}>
                    <View style={styles.buttonIcon}>
                      <Icon.Ionicons
                        name={item.icon}
                        size={30}
                        color={Colors.tabIconSelected}
                      />
                    </View>
                    <View style={styles.buttonText}><Text>{item.name}</Text></View>
                  </TouchableOpacity>
                }
              />
              <TouchableOpacity onPress={this._goto.bind(this, 'SignOut')} style={styles.elementEnd}>
                <View style={styles.buttonIcon}>
                  <Icon.Ionicons
                    name={Platform.OS === 'ios' ? `ios-close` : 'md-close'}
                    size={30}
                    color={Colors.tabIconSelected}
                  />
                </View>
                <View style={styles.buttonText}><Text>退出登录</Text></View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  userInfo() {
    this.sendAjax('userInfo', [], {}, (rst) => {
      this.setState({ user: rst, userDone: true, isLoadingComplete: this.state.numberDone });
    }, (error) => {
      CommonAlert.alert('错误', '获取用户信息失败');
    });
    this.sendAjax('userFollowNumber', [], {}, (rst) => {
      this.setState({ follows: rst.followsNum, followed: rst.followedNum, numberDone: true, isLoadingComplete: this.state.userDone });
    }, (error) => {
      CommonAlert.alert('错误', '获取关注信息失败');
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

  _goto = (route, params = {}) => {
    if (route == '') {
      return;
    }
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
    if (route == 'Sign') {
      params = { closable: true }
    } else if (route == 'SignOut') {
      this.signOutUser();
      return;
    } else if (route == 'Info') {
      this.setState({showEditInfo: true});
      return;
    }
    Common.toRoute(this, route, params);
  }

  _loadResourcesAsync = () => {
    this.setState({
      buttons: [
        {
          id: 1,
          icon: Platform.OS === 'ios' ? `ios-heart` : 'md-heart',
          name: '我关注的版块',
          route: 'FollowColumns',
          iconColor: Colors.tabIconSelected,
        },
        {
          id: 2,
          icon: Platform.OS === 'ios' ? `ios-paper` : 'md-paper',
          name: '我发布的帖子',
          route: 'MyPages',
          iconColor: Colors.tabIconSelected,
        },
        {
          id: 3,
          icon: Platform.OS === 'ios' ? `ios-star` : 'md-star',
          name: '我收藏的帖子',
          route: 'Collects',
          iconColor: Colors.tabIconSelected,
        },
        {
          id: 4,
          icon: Platform.OS === 'ios' ? `ios-swap` : 'md-swap',
          name: '切换账号',
          route: 'Sign',
          iconColor: Colors.tabIconSelected,
        },
      ],
    });
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
        this.userInfo();
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
});
