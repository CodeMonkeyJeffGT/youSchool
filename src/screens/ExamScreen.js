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
} from 'react-native';

import { AppLoading, Icon } from 'expo';
import Colors from '../constants/Colors';

import Common from '../components/Common';
import Ajax from '../components/Ajax';
import Uri from '../constants/Uri';
import CommonAlert from '../components/CommonAlert';
import Store from '../components/Store'

export default class ExamScreen extends React.Component {

  state = {
    isLoadingComplete: false,
    isLogin: false,
    pages: [],
  }

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: '考试',
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
          <View>
            <ShowTerms terms={this.state.scores} name={this.state.showTermName} father={this}/>
          </View>
          <View style={styles.welcomeContainer}>
            <Text>学期：{this.state.showTermName}</Text>
            <FlatList 
              data={[{id: 'a', name: '名称', place: '考场', time: '时间', num: '座位号'}] }
              keyExtractor={item => 'score' + item.id + ''}
              renderItem={({item}) => 
                <View
                  style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 10}}>
                  <Text style={{width: Dimensions.get('window').width / 4.4}}>{item.name}</Text>
                  <Text style={{width: Dimensions.get('window').width / 4.4}}>{item.place}</Text>
                  <Text style={{width: Dimensions.get('window').width / 4.4}}>{item.time}</Text>
                  <Text style={{width: Dimensions.get('window').width / 5}}>{item.num}</Text>
                </View>
              }
            />
            <FlatList 
              data={this.state.showScore}
              keyExtractor={item => 'score' + item.id + ''}
              renderItem={({item}) => 
                <View
                  style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 10}}>
                  <Text style={{width: Dimensions.get('window').width / 4.4}}>{item.name}</Text>
                  <Text style={{width: Dimensions.get('window').width / 4.4}}>{item.place}</Text>
                  <Text style={{width: Dimensions.get('window').width / 4.4}}>{item.time}</Text>
                  <Text style={{width: Dimensions.get('window').width / 5}}>{item.num}</Text>
                </View>
              }
            />
          </View>
        </ScrollView>
      </View>
    );
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

  scores() {
    this.setState({
      isLoadingComplete: true,
      showTermName: '2018-2',
      showscore: [
      ],
      scores: [
        {
          name: '2015-1',
          scores: [
            {
              id: 0,
              name: '大学英语三级',
              place: '丹青502',
              time: '3.2日 13:30-14:30',
              num: 2
            },
            {
              id: 1,
              name: '高等数学A1',
              place: '丹青402',
              time: '3.3日 13:30-14:30',
              num: 2
            },
            {
              id: 2,
              name: '大学生心理健康教育',
              place: '丹青502',
              time: '5.4日 13:30-14:30',
              num: 2
            },
            {
              id: 3,
              name: '语文',
              place: '丹青502',
              time: '6.7日 13:30-14:30',
              num: 2
            },
          ]
        },
        {
          name: '2015-2',
          scores: [
            {
              id: 1,
              name: '高等数学A1',
              place: '丹青402',
              time: '3.3日 13:30-14:30',
              num: 2
            },
            {
              id: 2,
              name: '大学生心理健康教育',
              place: '丹青502',
              time: '5.4日 13:30-14:30',
              num: 2
            },
            {
              id: 3,
              name: '语文',
              place: '丹青502',
              time: '6.7日 13:30-14:30',
              num: 2
            },
          ]
        },
        {
          name: '2016-1',
          scores: [
            {
              id: 0,
              name: '大学英语三级',
              place: '丹青502',
              time: '3.2日 13:30-14:30',
              num: 2
            },
            {
              id: 1,
              name: '高等数学A1',
              place: '丹青402',
              time: '3.3日 13:30-14:30',
              num: 2
            },
            {
              id: 2,
              name: '大学生心理健康教育',
              place: '丹青502',
              time: '5.4日 13:30-14:30',
              num: 2
            },
            {
              id: 3,
              name: '语文',
              place: '丹青502',
              time: '6.7日 13:30-14:30',
              num: 2
            },
            {
              id: 4,
              name: '语文',
              place: '丹青502',
              time: '6.7日 13:30-14:30',
              num: 2
            },
          ]
        },
        {
          name: '2016-2',
          scores: [
            {
              id: 0,
              name: '大学英语三级',
              place: '丹青502',
              time: '3.2日 13:30-14:30',
              num: 2
            },
            {
              id: 3,
              name: '语文',
              place: '丹青502',
              time: '6.7日 13:30-14:30',
              num: 2
            },
          ]
        },
        {
          name: '2017-1',
          scores: [
            {
              id: 0,
              name: '大学英语三级',
              place: '丹青502',
              time: '3.2日 13:30-14:30',
              num: 2
            },
            {
              id: 1,
              name: '高等数学A1',
              place: '丹青402',
              time: '3.3日 13:30-14:30',
              num: 2
            },
            {
              id: 3,
              name: '语文',
              place: '丹青502',
              time: '6.7日 13:30-14:30',
              num: 2
            },
            {
              id: 4,
              name: '语文',
              place: '丹青502',
              time: '6.7日 13:30-14:30',
              num: 2
            },
            {
              id: 2,
              name: '大学生心理健康教育',
              place: '丹青502',
              time: '5.4日 13:30-14:30',
              num: 2
            },
          ]
        },
        {
          name: '2017-2',
          scores: [
            {
              id: 0,
              name: '大学英语三级',
              place: '丹青502',
              time: '3.2日 13:30-14:30',
              num: 2
            },
            {
              id: 1,
              name: '高等数学A1',
              place: '丹青402',
              time: '3.3日 13:30-14:30',
              num: 2
            },
            {
              id: 2,
              name: '大学生心理健康教育',
              place: '丹青502',
              time: '5.4日 13:30-14:30',
              num: 2
            },
          ]
        },
        {
          name: '2018-1',
          scores: [
          ]
        },
        {
          name: '2018-2',
          scores: [
          ]
        },
      ]
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
        this.scores();
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
              this.props.father.setState({ showScore: item.scores, showTermName: item.name })
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
  plusIcon: {
    borderWidth: 1,
    borderColor: '#ededed',
    borderRadius: 10,
    marginLeft: 10,
    width: Dimensions.get('window').width - 20,
    height: 50,
    paddingLeft: Dimensions.get('window').width / 2 - 30,
  },
  showTerms: {
    marginTop: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ededed',
    width: Dimensions.get('window').width - 20,
    paddingTop: 5,
    paddingBottom: 5,
  },
  unselected: {
    marginLeft: 10,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 15,
    paddingRight: 15,
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
});
