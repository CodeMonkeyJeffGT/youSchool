import React from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import { AppLoading, Icon } from 'expo';
import Colors from '../constants/Colors';

import Common from '../components/Common';
import Ajax from '../components/Ajax';
import Uri from '../constants/Uri';
import CommonAlert from '../components/CommonAlert';

export default class ForumScreen extends React.Component {

  state = {
    isLoadingComplete: false,
    isLogin: false,
    searching: false,
    showSearchRstType: null,
    searchQuery: '',
    lists: [],
    listsLastId: 0,
    pages: [],
    pagesLastId: 0,
    columns: [],
    columnsLastId: 0,
    users: [],
    usersLastId: 0,
    applyColumn: false,
    name: '',
    desc: '',
  }

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: '论坛',
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
    if (this.state.applyColumn) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              <View style={styles.applyElement}>
                <Text sytle={styles.applyLabel}>
                  名称
                </Text>
                <TextInput
                  ref='name'
                  style={styles.applyInput} 
                  value={this.state.name}
                  onChangeText={(text) => this.setState({ name: text })}
                  onSubmitEditing={() => this.refs.desc.focus()}
                />
              </View>
              <View style={styles.applyElement}>
                <Text sytle={styles.applyLabel}>
                  简介
                </Text>
                <TextInput
                  ref='desc'
                  style={styles.applyInput} 
                  value={this.state.desc}
                  onChangeText={(text) => this.setState({ desc: text })}
                  onSubmitEditing={() => this.applyColumn()}
                />
              </View>
              <View style={styles.applyElement}>
                <TouchableOpacity
                  onPress={() => this.applyColumn()}
                >
                  <Text style={styles.applyButton}>创建版块</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.applyElement}>
                <TouchableOpacity
                  onPress={() => this.setState({applyColumn: false})}
                >
                  <Text style={styles.applyButton}>取消</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      )
    }
    if (this.state.showSearchRstType !== null) {
      switch (this.state.showSearchRstType) {
        case 'columns': 
          return (
            <View style={styles.container}>
              <SearchArea small={true} father={this} />
              <ShowType type='columns' father={this} />
              <View style={styles.rowArea}>
                <TouchableOpacity onPress={() => this.setState({applyColumn: true})}>
                  <Icon.Ionicons
                    name={Platform.OS === 'ios' ? `ios-add` : 'md-add'}
                    size={50}
                    style={styles.plusIcon}
                  />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <FlatList 
                  data={this.state.columns}
                  keyExtractor={item => item.id + ''}
                  renderItem={({item}) => 
                    <TouchableOpacity onPress={this.columnDetail.bind(this, item.id)} style={styles.columnElement}>
                      <Text style={styles.columnName}>{item.name}</Text>
                      <Text style={styles.columnDesc}>{item.description}</Text>
                      <Text style={styles.columnLike}>关注：{item.followNum}人</Text>
                    </TouchableOpacity>
                  }
                />
              </ScrollView>
            </View>
          );
        case 'pages':
          return (
            <View style={styles.container}>
              <SearchArea small={true} father={this} />
              <ShowType type='pages' father={this} />
              <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.welcomeContainer}>
                  <FlatList 
                    data={this.state.menu1}
                    keyExtractor={item => item.id + ''}
                    renderItem={({item}) => 
                      <TouchableOpacity onPress={this._goto.bind(this, item.route)} style={Object.assign({backgroundColor: item.bgColor}, styles.element)}>
                        <Icon.Ionicons
                          name={item.icon}
                          size={50}
                          color={item.iconColor}
                        />
                        <Text style={{color: item.color, textAlign: 'center'}}>{item.name}</Text>
                      </TouchableOpacity>
                    }
                  />
                </View>
              </ScrollView>
            </View>
          );
        case 'users':
          return (
            <View style={styles.container}>
              <SearchArea small={true} father={this} />
              <ShowType type='users' father={this} />
              <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.welcomeContainer}>
                  <FlatList 
                    data={this.state.users}
                    keyExtractor={item => item.id + ''}
                    renderItem={({item}) => 
                      <View style={styles.userContainer}>
                        <View style={styles.userIconContainer}>
                          <Image
                            source={{ uri: item.headpic == '' ? 'http://you.nefuer.net/imgs/default.png' : 'http://you.nefuer.net' + item.headpic }}
                            style={{ width: 64, height: 64, borderRadius: 50, }}
                            resizeMode="cover"
                          />
                        </View>
                        <View style={styles.titleTextContainer}>
                          <Text style={styles.nameText} numberOfLines={1}>
                            {item.nickname}
                          </Text>
                          <Text style={styles.slugText} numberOfLines={1}>
                            {item.school.name}
                          </Text>
                          <Text style={styles.descriptionText}>
                            {item.sign}
                          </Text>
                        </View>
                      </View>
                    }
                  />
                </View>
              </ScrollView>
            </View>
          );
      }
    }
    return (
      <View style={styles.container}>
        <SearchArea small={false} father={this} />
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <FlatList 
              data={this.state.menu1}
              keyExtractor={item => item.id + ''}
              renderItem={({item}) => 
                <TouchableOpacity onPress={this._goto.bind(this, item.route)} style={Object.assign({backgroundColor: item.bgColor}, styles.element)}>
                  <Icon.Ionicons
                    name={item.icon}
                    size={50}
                    color={item.iconColor}
                  />
                  <Text style={{color: item.color, textAlign: 'center'}}>{item.name}</Text>
                </TouchableOpacity>
              }
            />
          </View>
        </ScrollView>
      </View>
    );
  }

  columnDetail = (id) => {
    this._goto('Columns', {id: id});
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

  search()
  {
    if (this.state.showSearchRstType == null) {
      this.setState({showSearchRstType: 'pages'});
    }
    this.searchPage();
    this.searchColumn();
    this.searchUser();
  }

  searchPage()
  {
    let lastId = this.state.searchQuery == '' ? this.state.listsLastId : 0;
    this.sendAjax('pageList', [], {query: this.state.searchQuery, lastId: 0}, (rst) => {
      if (this.state.searchQuery == '') {
        this.setState({lists: rst});
        if (rst.length != 0) {
          this.setState({listsLastId: rst[rst.length - 1].id});
        }
      } else {
        this.setState({pages: rst});
        if (rst.length != 0) {
          this.setState({pagesLastId: rst[rst.length - 1].id});
        }
      }
    }, (error) => {
      CommonAlert.alert('错误', '获取帖子列表失败');
    })
  }

  searchColumn()
  {
    this.sendAjax('columnList', [], {query: this.state.searchQuery, lastId: 0}, (rst) => {
      this.setState({columns: rst});
      if (rst.length != 0) {
        this.setState({columnsLastId: rst[rst.length - 1].id});
      }
    }, (error) => {
      CommonAlert.alert('错误', '获取列表失败');
    })
  }

  searchUser()
  {
    this.sendAjax('searchUsers', [], {query: this.state.searchQuery}, (rst) => {
      this.setState({users: rst});
    }, (error) => {
      CommonAlert.alert('错误', '获取列表失败');
    })
  }

  applyColumn() {
    this.sendAjax('columnApply', [], {name: this.state.name, description: this.state.desc}, (rscst) => {
      this.setState({applyColumn: false});
      CommonAlert.alert('恭喜', '创建版块成功,请重新搜索查看');
    }, (error) => {
      CommonAlert.alert('错误', '创建版块失败');
    })
    this.setState({name: '', desc: ''})
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
          Common.toSign(this);
          throw error;
        }
      );
    }
    this.ajaxReal(uriName, replaces, datas, success, errorFun);
  }

  ajaxReal = (uriName, replaces, datas, successFun, errorFun) => {
    let uri = Uri[uriName].uri;
    replaces.forEach(key => {
      uri = uri.replace('{' + key + '}', replaces[key]);
    });
    Ajax.send(Uri[uriName].method, uri, datas)
    .then((rst) => {
      successFun(rst);
    })
    .catch((error) => {
      errorFun(error);
    });
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

  _loadResourcesAsync = () => {
    Common.checkSign()
    .then(
      (rst) => {
        this.setState({ isLogin : true });
        this.searchPage();
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
    this.setState({ isLoadingComplete: true });
  };
}

class ShowType extends React.Component {

  render() {
    let data = [
      {
        key: 'pages',
        name: '帖子',
        style: this.props.type=='pages' ? styles.selected : styles.unselected,
      },
      {
        key: 'columns',
        name: '版块',
        style: this.props.type=='columns' ? styles.selected : styles.unselected,
      },
      {
        key: 'users',
        name: '用户',
        style: this.props.type=='users' ? styles.selected : styles.unselected,
      },
    ]
    return (
      <View>
        <FlatList 
          style={styles.showType}
          data={data}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({item}) => 
            <TouchableOpacity onPress={() => this.props.father.setState({ showSearchRstType: item.key })}>
              <Text style={item.style}>{item.name}</Text>
            </TouchableOpacity>
          }
        />
      </View>
    );
  }
}

class SearchArea extends React.Component {
  render() {
    if (this.props.small) {
      return (
        <View style={Object.assign({height: 30, marginBottom: 5}, styles.rowArea)}>
          <TextInput
            ref='searchInput'
            style={styles.searchInputSmall}
            onFocus={this.props.father.checkSign}
            onSubmitEditing={this.props.father.search.bind(this.props.father)}
            onChangeText={(text) => this.props.father.setState({ searchQuery: text })}
            value={this.props.father.state.searchQuery}
            placeholder='搜索'
            returnKeyType='search'
            placeholderTextColor={Colors.secondary}
          />
          <TouchableOpacity
            onPress={() => this.props.father.setState({showSearchRstType: null, searchQuery: ''})}
          >
            <Text style={styles.searchCancel}>取消</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View style={Object.assign({height: 30, marginBottom: 5}, styles.rowArea)}>
          <TextInput
            ref='searchInput'
            style={styles.searchInput}
            onFocus={this.props.father.checkSign}
            onSubmitEditing={this.props.father.search.bind(this.props.father)}
            onChangeText={(text) => this.props.father.setState({ searchQuery: text })}
            value={this.props.father.state.searchQuery}
            placeholder='搜索'
            returnKeyType='search'
            placeholderTextColor={Colors.secondary}
          />
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
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
    // flex: 1,
    flexDirection: 'row',
    // backgroundColor: 'green',
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
