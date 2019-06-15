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
  Platform,
  Alert,
  TextInput,
} from 'react-native';

import { AppLoading, Icon } from 'expo';
import Colors from '../constants/Colors';

import Common from '../components/Common';
import Ajax from '../components/Ajax';
import Uri from '../constants/Uri';
import CommonAlert from '../components/CommonAlert';
import Store from '../components/Store'

export default class MyPagesScreen extends React.Component {

  state = {
    isLoadingComplete: false,
    comment: '',
    comments: [],
    isLogin: false,
    pages: [],
  }

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: '帖子详情',
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
            <View>
              <View style={styles.userPageContainer}>
                <View style={styles.userIconContainer}>
                  <Image
                    source={{ uri: this.state.page.user.headpic == '' ? 'http://you.nefuer.net/imgs/default.png' : 'http://you.nefuer.net' + this.state.page.user.headpic }}
                    style={{ width: 64, height: 64, borderRadius: 50, }}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.titleTextContainer}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {this.state.page.user.nickname}
                  </Text>
                  <Text style={styles.slugText} numberOfLines={1}>
                    {this.state.page.user.school.name}
                  </Text>
                  <Text style={styles.descriptionText}>
                    {this.state.page.column.name} {this.state.page.column.type}
                  </Text>
                </View>
              </View>
              <View style={styles.pageContainer}>
                <View style={styles.titleTextContainer}>
                  <Text style={styles.nameText} numberOfLines={1}>
                    {this.state.page.name}
                  </Text>
                  <Text style={styles.contentText} numberOfLines={1}>
                    {this.state.page.content}
                  </Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonWidth} onPress={() => this.likeSwitch(this.state.page.id, this.state.page.isLike)}>
                  <Icon.Ionicons
                    name={(Platform.OS === 'ios' ? `ios-heart` : 'md-heart') + (this.state.page.isLike ? '' : '-empty')}
                    style={styles.btnIcons}
                    size={20}
                    color={Colors.tabIconSelected}
                  />
                  <Text style={styles.btnText}>{this.state.page.likeNum}</Text>
                </TouchableOpacity>
                <View style={styles.axis}/>
                <TouchableOpacity style={styles.buttonWidth} onPress={() => this.collectSwitch(this.state.page.id, this.state.page.isCollect)}>
                  <Icon.Ionicons
                    name={(Platform.OS === 'ios' ? `ios-star` : 'md-star') + (this.state.page.isCollect ? '' : '-outline')}
                    style={styles.btnIcons}
                    size={20}
                    color={Colors.tabIconSelected}
                  />
                  <Text style={styles.btnText}>{this.state.page.collectNum}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-end', paddingBottom: 10}}>
              <TextInput
                style={styles.commentInput}
                value={this.state.comment}
                onChangeText={(text) => this.setState({ comment: text })}
                placeholder='评论'
                multiline={true}
              />
              <TouchableOpacity
                onPress={this.comment}
              >
                <Text style={styles.commentButton}>评论</Text>
              </TouchableOpacity>
            </View>
            <View>
              <FlatList
                style={{}}
                data={this.state.comments}
                keyExtractor={item => 'pageDetail' + item.id + ''}
                renderItem={({item}) =>
                  <View style={{marginTop: 5}}>
                    <View style={styles.userPageContainer}>
                      <View style={styles.userIconContainer}>
                        <Image
                          source={{ uri: item.user.headpic == '' ? 'http://you.nefuer.net/imgs/default.png' : 'http://you.nefuer.net' + item.user.headpic }}
                          style={{ width: 40, height: 40, borderRadius: 50, }}
                          resizeMode="cover"
                        />
                      </View>
                      <View style={styles.titleTextContainer}>
                        <Text style={styles.nameText} numberOfLines={1}>
                          {item.user.nickname}
                        </Text>
                        <Text style={styles.slugText} numberOfLines={1}>
                          {item.user.school.name}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pageContainer}>
                      <View style={styles.titleTextContainer}>
                        <Text style={styles.contentText} numberOfLines={10}>
                          {item.content}
                        </Text>
                      </View>
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

  userDetail = (id) => {
    this._goto('Detail', {id: id});
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

  comment = () => {
    let comment = this.state.comment;
    const pid = this.props.navigation.getParam('id');
    console.log(pid);
    if ('' != comment) {
      this.sendAjax('pageComment', {pid: pid}, {content: comment}, (rst) => {
        this.pageDetail();
      }, (error) => {
        console.log(error);
        CommonAlert.alert('错误', msg + '评论失败');
      })
    }
  }

  likeSwitch = (id, status) => {
    let uri = status ? 'pageUnlike' : 'pageLike';
    let msg = status ? '取消' : '';
    this.sendAjax(uri, {pid: id}, {}, (rst) => {
      this.pageDetail();
    }, (error) => {
      console.log(error);
      CommonAlert.alert('错误', msg + '点赞失败');
    });
  }

  collectSwitch = (id, status) => {
    let uri = status ? 'pageUncollect' : 'pageCollect';
    let msg = status ? '取消' : '';
    if (status) {
      Alert.alert('提示', '是否取消收藏？', [
        {text: '取消'},
        {text: '确认', onPress: () => {
          this.sendAjax(uri, {pid: id}, {}, (rst) => {
            this.pageDetail();
          }, (error) => {
            console.log(error);
            CommonAlert.alert('错误', msg + '收藏失败');
          });
        }},
      ])
    } else {
      this.sendAjax(uri, {pid: id}, {}, (rst) => {
        this.pageDetail();
      }, (error) => {
        console.log(error);
        CommonAlert.alert('错误', msg + '取消收藏失败');
      });
    }
    
  }

  pageDetail = () => {
    const id = this.props.navigation.getParam('id');
    let done = this.state.isLoadingComplete;
    this.sendAjax('pageInfo', {id: id}, {}, (rst) => {
      let types = ['[学校V]', '[热门V]', ''];
      rst.column.type = types[rst.column.type];
      this.setState({ page: rst, isLoadingComplete: done });
      done = true;
    }, (error) => {
      console.log(error);
      CommonAlert.alert('错误', msg + '获取帖子详情失败');
    });
    this.sendAjax('pageCommentList', {pid: id}, {}, (rst) => {
      console.log(rst);
      this.setState({ comments: rst, isLoadingComplete: done });
      done = true;
    }, (error) => {
      console.log(error);
      CommonAlert.alert('错误', msg + '获取帖子详情失败');
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
        this.pageDetail();
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
}

const styles = StyleSheet.create({
  commentButton: {
    height: 26,
  },
  commentInput: {
    width: Dimensions.get('window').width - 128,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 2,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 10,
    marginRight: 10,
    borderRadius: 12,
  },
  plusIcon: {
    borderWidth: 1,
    borderColor: '#ededed',
    borderRadius: 10,
    marginLeft: 10,
    width: Dimensions.get('window').width - 20,
    height: 50,
    paddingLeft: Dimensions.get('window').width / 2 - 30,
  },
  showType: {
    marginTop: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ededed',
    width: Dimensions.get('window').width,
    paddingTop: 5,
    paddingBottom: 5,
  },
  selected: {
    marginLeft: 10,
    paddingTop: 3.5,
    paddingBottom: 3.5,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 19,
    backgroundColor: Colors.dividerColor,
  },
  unselected: {
    marginLeft: 10,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 25,
    paddingRight: 25,
    fontSize: 14,
    color: Colors.secondary,
  },
  rowArea: {
    flexDirection: 'row',
  },
  searchInput: {
    marginTop: 5,
    marginLeft: 10,
    paddingLeft: 10,
    height: 30,
    marginBottom: 5,
    width: Dimensions.get('window').width - 20,
    backgroundColor: Colors.dividerColor,
  },
  searchInputSmall: {
    marginTop: 5,
    marginLeft: 10,
    paddingLeft: 10,
    height: 30,
    marginBottom: 5,
    width: Dimensions.get('window').width - 100,
    backgroundColor: Colors.dividerColor,
  },
  searchCancel: {
    marginTop: 5,
    marginBottom: 0,
    width: 80,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: 'center',
  },
  element: {
    width: Dimensions.get('window').width * 0.34,
    height: Dimensions.get('window').width * 0.34 * 0.7,
    marginBottom: Dimensions.get('window').width * 0.08,
    marginLeft: Dimensions.get('window').width * 0.08 - 15,
    marginRight: Dimensions.get('window').width * 0.08 - 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 }, 
    shadowOpacity: 0.8, 
    shadowRadius: 6, 
    elevation: 10,
    fontSize: 20,
  },
  container: {
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
  applyElement: {
    width: Dimensions.get('window').width- 60,
    marginBottom: 30,
  },
  applyLabel: {
    fontSize: 25,
    marginBottom: 5,
  },
  applyInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 3,
  },
  applyButton: {
    fontSize: 25,
    padding: 5,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 3,
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
  pageElement: {
    padding: 5,
  },
  pageTitle: {

  },
  pageContent: {

  },
  pageLike: {

  },
  pageComment: {

  },
  pageCollect: {

  },
  userContainer: {
    paddingHorizontal: 15,
    paddingTop: 8,
    paddingBottom: 8,
    flexDirection: 'row',
    backgroundColor: Colors.dividerColor,
    marginBottom: 5,
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
    width: (Dimensions.get('window').width- 111) / 2,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnIcons: {
  },
  btnText: {
    marginLeft: 5,
    color: Colors.tabIconSelected,
  },
});
