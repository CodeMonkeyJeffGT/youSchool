import React from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppLoading, Icon } from 'expo';
import Colors from '../constants/Colors';

import Common from '../components/Common';
import Store from '../components/Store'

export default class HomeScreen extends React.Component {

  state = {
    isLoadingComplete: false,
    isLogin: false,
  }

  constructor(props) {
    super(props);
  }

  static navigationOptions = {
    title: '功能菜单',
    headerTitleStyle: {
      flex:1,
      textAlign: 'center',
    },
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
            <FlatList 
              data={this.state.menu1}
              keyExtractor={item => item.id + ''}
              renderItem={({item}) => 
                <TouchableOpacity onPress={this._goto.bind(this, item.route)} style={Object.assign({backgroundColor: item.bgColor}, styles.element)}>
                  <Icon.Ionicons
                    name={item.icon}
                    size={50}
                    // style={{ marginBottom: -3 }}
                    color={item.iconColor}
                  />
                  <Text style={{color: item.color, textAlign: 'center'}}>{item.name}</Text>
                </TouchableOpacity>
              }
            />
            <FlatList 
              data={this.state.menu2}
              keyExtractor={item => item.id + ''}
              renderItem={({item}) => 
                <TouchableOpacity onPress={this._goto.bind(this, item.route)} style={Object.assign({backgroundColor: item.bgColor}, styles.element)}>
                  <Icon.Ionicons
                    name={item.icon}
                    size={50}
                    // style={{ marginBottom: -3 }}
                    color={Colors.tabIconSelected}
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
    if (route == 'Sign') {
      params = { closable: true }
    } else if (route === 'SignOut') {
      this.signOutUser();
      return;
    }
    Common.toRoute(this, route, params);
  }

  signOutUser = () => {
    Store.unset('signature')
    .then(
      () => {
        this.setState({ isLoadingComplete: true });
      }
    )
  }

  _loadResourcesAsync = () => {
    this.setState(
      {
        menu1: [
          {
            id: 1,
            icon: Platform.OS === 'ios' ? `ios-checkmark` : 'md-checkmark',
            name: '成绩',
            route: 'Score',
            bgColor: '#B2EBF2',
            iconColor: Colors.tabIconSelected,
            color: Colors.tabIconSelected,
          },
          {
            id: 2,
            icon: Platform.OS === 'ios' ? `ios-calendar` : 'md-calendar',
            name: '课表',
            route: 'Lesson',
            bgColor: '#F0F4C3',
            iconColor: Colors.tabIconSelected,
            color: Colors.tabIconSelected,
          },
          {
            id: 5,
            icon: Platform.OS === 'ios' ? `ios-person` : 'md-person',
            name: '切换账号',
            route: 'Sign',
            bgColor: '#E1BEE7',
            iconColor: Colors.tabIconSelected,
            color: Colors.tabIconSelected,
          },
        ],
        menu2: [
          {
            id: 3,
            icon: Platform.OS === 'ios' ? `ios-paper` : 'md-paper',
            name: '考试',
            route: 'Exam',
            bgColor: '#FFECB3',
            iconColor: Colors.tabIconSelected,
            color: Colors.tabIconSelected,
          },
          {
            id: 4,
            icon: Platform.OS === 'ios' ? `ios-create` : 'md-create',
            name: '编辑',
            route: 'EditMenu',
            bgColor: '#F5F5F5',
            iconColor: Colors.tabIconSelected,
            color: Colors.tabIconSelected,
          },
          {
            id: 6,
            icon: Platform.OS === 'ios' ? `ios-close` : 'md-close',
            name: '退出登录',
            route: 'SignOut',
            bgColor: '#FFCDD2',
            iconColor: Colors.tabIconSelected,
            color: Colors.tabIconSelected,
          },
        ],
      }
    );
    Common.checkSign()
    .then(
      (rst) => {
        this.setState({ isLogin : true });
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

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };

}

const styles = StyleSheet.create({
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
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30,
  },
});
