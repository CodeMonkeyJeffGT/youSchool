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
    sign: '',
    action: '',
  }

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: '用户信息',
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
              <View style={styles.followNumber}><Text style={{textAlign: 'center'}}>关注 {this.state.follows}</Text></View>
              <View style={styles.axis}/>
              <View style={styles.followNumber}><Text style={{textAlign: 'center'}}>粉丝 {this.state.followed}</Text></View>
            </View>
            <View>
              <TouchableOpacity
                onPress={this.followSwitch}
              >
                <Text style={styles.followButton}>{this.state.btnStr}</Text>
            </TouchableOpacity></View>
            <View style={{marginTop: 20}}><FlatList 
                    data={this.state.pages}
                    keyExtractor={item => 'forumPages' + item.id + ''}
                    renderItem={({item}) => 
                      <View>
                        <TouchableOpacity onPress={() => this.pageDetail(item.id)}>
                          <View style={styles.pageContainer}>
                            <View style={styles.titleTextContainer}>
                              <Text style={styles.nameText} numberOfLines={1}>
                                {item.name}
                              </Text>
                              <Text style={styles.descriptionText}>
                                {item.column.name} {item.column.type}
                              </Text>
                              <Text style={styles.contentText} numberOfLines={10}>
                                {item.content}
                              </Text>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.buttonContainer}>
                          <TouchableOpacity style={styles.buttonWidth} onPress={() => this.likeSwitch(item.id, item.isLike)}>
                            <Icon.Ionicons
                              name={(Platform.OS === 'ios' ? `ios-heart` : 'md-heart') + (item.isLike ? '' : '-empty')}
                              style={styles.btnIcons}
                              size={20}
                              color={Colors.tabIconSelected}
                            />
                            <Text style={styles.btnText}>{item.likeNum}</Text>
                          </TouchableOpacity>
                          <View style={styles.axis}/>
                          <TouchableOpacity style={styles.buttonWidth} onPress={() => this.pageDetail(item.id)}>
                            <Icon.Ionicons
                              name={Platform.OS === 'ios' ? `ios-text` : 'md-text'}
                              style={styles.btnIcons}
                              size={20}
                              color={Colors.tabIconSelected}
                            />
                            <Text style={styles.btnText}>{item.commentNum}</Text>
                          </TouchableOpacity>
                          <View style={styles.axis}/>
                          <TouchableOpacity style={styles.buttonWidth} onPress={() => this.collectSwitch(item.id, item.isCollect)}>
                            <Icon.Ionicons
                              name={(Platform.OS === 'ios' ? `ios-star` : 'md-star') + (item.isCollect ? '' : '-outline')}
                              style={styles.btnIcons}
                              size={20}
                              color={Colors.tabIconSelected}
                            />
                            <Text style={styles.btnText}>{item.collectNum}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    }
                  />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  followSwitch = () => {
    if (this.state.action == '') {
      return;
    }
    this.sendAjax(this.state.action, {id: this.props.navigation.getParam('id')}, {}, (rst) => {
      this.userInfo();
    }, (error) => {
      CommonAlert.alert('错误', '操作失败');
    });
  }

  userInfo = () => {
    let uDone = this.state.isLoadingComplete;
    let fDone = this.state.isLoadingComplete;
    let pDone = this.state.isLoadingComplete;
    this.sendAjax('userInfoOthers', {id: this.props.navigation.getParam('id')}, {}, (rst) => {
      this.setState({ user: rst, isLoadingComplete: fDone && pDone });
      if (rst.isMe) {
        this.setState({btnStr: '我', action: ''})
      } else {
        if (rst.isFollowed) {
          if (rst.isFollows) {
            this.setState({btnStr: '互相关注', action: 'userUnfollow'});
          } else {
            this.setState({btnStr: '被关注', action: 'userFollow'});
          }
        } else {
          if (rst.isFollows) {
            this.setState({btnStr: '已关注', action: 'userUnfollow'});
          } else {
            this.setState({btnStr: '关注', action: 'userFollow'});
          }
        }
      }
      uDone = true;
    }, (error) => {
      CommonAlert.alert('错误', '获取用户信息失败');
    });
    this.sendAjax('userFollowNumberOthers', {id: this.props.navigation.getParam('id')}, {}, (rst) => {
      this.setState({ follows: rst.followsNum, followed: rst.followedNum, isLoadingComplete: uDone && pDone });
      fDone = true;
    }, (error) => {
      CommonAlert.alert('错误', '获取关注信息失败');
    });
    this.sendAjax('othersPage', {uid: this.props.navigation.getParam('id')}, {}, (rst) => {
      let types = ['[学校V]', '[热门V]', ''];
      for(var key in rst) {
        rst[key].column.type = types[rst[key].column.type];
      }
      this.setState({ pages: rst, isLoadingComplete: uDone && fDone });
      pDone = true;
    }, (error) => {
      CommonAlert.alert('错误', '获取关注信息失败');
    });
  }

  userDetail = (id) => {
    this._goto('Detail', {id: id});
  }

  pageDetail = (id) => {
    this._goto('Pages', {id: id});
  }

  columnDetail = (id) => {
    this._goto('Columns', {id: id});
  }
  
  likeSwitch = (id, status) => {
    let uri = status ? 'pageUnlike' : 'pageLike';
    let msg = status ? '取消' : '';
    this.sendAjax(uri, {pid: id}, {}, (rst) => {
      this.searchPage(this.state.showSearchRstType == null);
    }, (error) => {
      console.log(error);
      CommonAlert.alert('错误', msg + '点赞失败');
    });
  }

  collectSwitch = (id, status) => {
    let uri = status ? 'pageUncollect' : 'pageCollect';
    let msg = status ? '取消' : '';
    this.sendAjax(uri, {pid: id}, {}, (rst) => {
      this.searchPage(this.state.showSearchRstType == null);
    }, (error) => {
      console.log(error);
      CommonAlert.alert('错误', msg + '收藏失败');
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
  followButton: {
    marginLeft: (Dimensions.get('window').width- 200) / 2,
    marginTop: 20,
    fontSize: 16,
    width: 120,
    paddingBottom: 7,
    paddingTop: 7,
    borderRadius: 50,
    textAlign: 'center',
    alignItems: 'center',
    backgroundColor: Colors.lightPrimary,
  },
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
  userPageContainer: {
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    backgroundColor: Colors.dividerColor,
  },
  pageContainer: {
    paddingHorizontal: 15,
    paddingBottom: 8,
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
  contentText: {
    fontSize: 14,
    marginTop: 6,
    color: '#4d4d4d',
  },
  buttonContainer: {
    paddingHorizontal: 15,
    paddingBottom: 5,
    flexDirection: 'row',
    backgroundColor: Colors.dividerColor,
    marginBottom: 5,
  },
  axis: {
    borderLeftWidth: 1,
    borderColor: Colors.accent,
  },
  buttonWidth: {
    width: (Dimensions.get('window').width- 112) / 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnText: {
    marginLeft: 5,
    color: Colors.tabIconSelected,
  },
});
