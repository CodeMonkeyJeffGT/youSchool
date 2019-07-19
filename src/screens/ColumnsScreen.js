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
    title: '版块详情',
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
    if (this.state.publish) {
      return (
        <View style={styles.welcomeContainer}>
          <View style={styles.signElement}>
            <Text sytle={styles.signLabel}>
              标题
            </Text>
            <TextInput
              style={styles.signInput} 
              value={this.state.publishTitle}
              onChangeText={(text) => this.setState({ publishTitle: text })}
            />
          </View>
          <View style={styles.signElement}>
            <Text sytle={styles.signLabel}>
              内容
            </Text>
            <TextInput
              style={styles.signInput} 
              value={this.state.publishContent}
              onChangeText={(text) => this.setState({ publishContent: text })}
              multiline={true}
            />
          </View>
          <View style={styles.signElement}>
            <TouchableOpacity
              onPress={this.publish}
            >
              <Text style={styles.signButton}>发布</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.signElement}>
            <TouchableOpacity
              onPress={() => this.setState({publish: false})}
            >
              <Text style={styles.signButton}>取消</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <View style={styles.columnElement}>
              <Text style={styles.columnName}>{this.state.column.name} {this.state.column.type}</Text>
              <Text style={styles.columnDesc}>{this.state.column.description}</Text>
              <Text style={styles.columnLike}>关注：{this.state.column.followNum}人</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.buttonWidth} onPress={() => this.switchFollow()}>
                      <Text style={{backgroundColor: Colors.lightPrimary, paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5, borderRadius: 50, marginBottom: 10}}>{this.state.followBtnStr}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonWidth} onPress={() => this.setState({publish: true})}>
                      <Text style={{backgroundColor: Colors.lightPrimary, paddingLeft: 20, paddingRight: 20, paddingTop: 5, paddingBottom: 5, borderRadius: 50, marginBottom: 10}}>发帖</Text>
                    </TouchableOpacity>
            </View>
            <View>
              <ShowTerms terms={[{name: '学习交流'}, {name: '寝室生活'}, {name: '资源分享'}, {name: '失物招领'}, {name: '二手交易'}, {name: '闲聊区'}]} name={this.state.showTermName} father={this}/>
            </View>
            <Text>{this.showTermName}</Text>
            <FlatList 
              data={this.state.pages}
              keyExtractor={item => 'forumLists' + item.id + ''}
              renderItem={({item}) => 
                <View>
                  <TouchableOpacity onPress={() => this.pageDetail(item.id)}>
                    <View style={styles.userPageContainer}>
                      <View style={styles.userIconContainer}>
                        <Image
                          source={{ uri: item.user.headpic == '' ? 'http://you.nefuer.net/imgs/default.png' : 'http://you.nefuer.net' + item.user.headpic }}
                          style={{ width: 64, height: 64, borderRadius: 50, }}
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
                        <Text style={styles.descriptionText}>
                          {item.column.name} {item.column.type}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pageContainer}>
                      <View style={styles.titleTextContainer}>
                        <Text style={styles.nameText} numberOfLines={1}>
                          {item.name}
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
        </ScrollView>
      </View>
    );
  }

  switchFollow = () => {
    uri = (this.state.followBtnStr == '关注') ? 'columnFollow' : 'columnUnfollow';
    this.sendAjax(uri, {id: this.state.id}, {}, (rst) => {
      this.column();
    }, (error) => {
      console.log(error);
      CommonAlert.alert('错误', msg + '操作失败');
    });
  }

  publish = () => {
    let title = this.state.publishTitle;
    let content = this.state.publishContent;
    if (title == '' || content == '') {
      return;
    }
    let data = {
      name: title,
      content: content,
    };
    let id = this.state.id;
    data.columnId = id;
    let cid = this.state.cid;
    if (cid) {
      data.classId = cid;
    }
    this.sendAjax('pagePublish', {}, data, (rst) => {
      this.setState({publishContent: '', publishTitle: '', publish: false});
      this.column();
    }, (error) => {
      console.log(error);
      CommonAlert.alert('错误', msg + '点赞失败');
    });
  }

  userDetail = (id) => {
    this._goto('Detail', {id: id});
  }

  pageDetail = (id) => {
    this._goto('Pages', {id: id});
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


  likeSwitch = (id, status) => {
    let uri = status ? 'pageUnlike' : 'pageLike';
    let msg = status ? '取消' : '';
    this.sendAjax(uri, {pid: id}, {}, (rst) => {
      this.column();
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
            this.column();
          }, (error) => {
            console.log(error);
            CommonAlert.alert('错误', msg + '收藏失败');
          });
        }},
      ])
    } else {
      this.sendAjax(uri, {pid: id}, {}, (rst) => {
        this.column();
      }, (error) => {
        console.log(error);
        CommonAlert.alert('错误', msg + '取消收藏失败');
      });
    }
    
  }

  column = () => {
    let data = {};
    let id = this.state.id;
    data.id = id;
    let cid = this.state.cid;
    if (cid) {
      data.cid = cid;
    }
    data.sp = this.state.sp;
    let cdone = this.state.isLoadingComplete;
    let ldone = this.state.isLoadingComplete;
    this.sendAjax('columnInfo', {id: id}, {}, (rst) => {
      let types = ['[学校V]', '[热门V]', ''];
      rst.type = types[rst.type];
      cdone = true;
      this.setState({ followBtnStr: (rst.isFollowed ? '已关注' : '关注'), sp: '', column: rst, isLoadingComplete: cdone && ldone });
    }, (error) => {
      console.log(error);
      CommonAlert.alert('错误', msg + '获取版块详情失败');
    });
    this.sendAjax('pageList', {}, data, (rst) => {
      ldone = true;
      let types = ['[学校V]', '[热门V]', ''];
      for(var key in rst) {
        rst[key].column.type = types[rst[key].column.type];
      }
      this.setState({ pages: rst, isLoadingComplete: cdone && ldone });
    }, (error) => {
      console.log(error);
      CommonAlert.alert('错误', msg + '获取帖子列表失败');
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
        this.setState({
          isLogin : true,
          id: this.props.navigation.getParam('id'),
          cid: this.props.navigation.getParam('cid'),
          sp: this.props.navigation.getParam('sp'),
        });
        this.column();
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

class ShowTerms extends React.Component {

  render() {
    let data = this.props.terms;
    return (
      <View>
        <FlatList 
          style={styles.showTerms}
          data={data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.name}
          renderItem={({item}) => 
            <TouchableOpacity onPress={() => {
              this.props.father.setState({ showTermName: item.name })
            }}>
              <Text style={styles.unselected}>{item.name}</Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  }
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
    width: (Dimensions.get('window').width- 112) / 3,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  btnIcons: {
  },
  btnText: {
    marginLeft: 5,
    color: Colors.tabIconSelected,
  },
  signElement: {
    width: Dimensions.get('window').width- 60,
    marginBottom: 30,
  },
  signLabel: {
    fontSize: 25,
    marginBottom: 5,
  },
  signInput: {
    borderColor: 'gray',
    borderWidth: 1,
    padding: 3,
  },
  signButton: {
    fontSize: 25,
    padding: 5,
    textAlign: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 3,
  },
  showTerms: {
    marginTop: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ededed',
    width: Dimensions.get('window').width - 80,
    paddingTop: 5,
    paddingBottom: 5,
  },
});
