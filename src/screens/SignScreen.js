import React from 'react';
import {
  FlatList,
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  BackHandler,
} from 'react-native';

import Common from '../components/Common';
import Ajax from '../components/Ajax';
import Uri from '../constants/Uri';
import CommonAlert from '../components/CommonAlert';
import Store from '../components/Store'

export default class extends React.Component {
  static navigationOptions = {
    title: '登录',
  };

  constructor(props) {
    super(props);
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  state = {
    firstEdit: true,
    accAutoFocus: false,
    posting: false,
    showSchools: true,
    schoolId: 0,
    schoolName: '请选择学校',
    account: '',
    password: '',
    signature: '',
    others: [],
    schoolsList: [
      {
        'id': 1,
        'name': '东北林业大学',
      },
      {
        'id': 2,
        'name': '示例大学',
      },
      {
        'id': 3,
        'name': '北京大学',
      },
      {
        'id': 4,
        'name': '清华大学',
      },
      {
        'id': 5,
        'name': '哈尔滨理工大学',
      },
      {
        'id': 6,
        'name': '哈尔滨工业大学',
      },
      {
        'id': 7,
        'name': '哈尔滨工程大学',
      },
      {
        'id': 8,
        'name': '西北农林科技大学',
      },
    ],
  }

  render() {
    if (this.props.navigation.getParam('closable', false) && this.state.firstEdit) {
      this.setState({ showSchools: false, firstEdit: false });
    }
    if (this.state.showSchools) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              <Text sytle={styles.applyLabel}>
                选择学校：
              </Text>
              <TouchableOpacity
                onPress={() => this.setState({ showSchools: false })}
              >
                <Text style={styles.cancelSchool}>取消</Text>
              </TouchableOpacity>
              <FlatList 
                data={this.state.schoolsList}
                keyExtractor={item => 'schoolsSign' + item.id + ''}
                renderItem={({item}) => 
                  <TouchableOpacity onPress={this.chooseSchool.bind(this, item)} >
                    <Text style={styles.schoolElement}>{item.name}</Text>
                  </TouchableOpacity>
                }
              />
            </View>
          </ScrollView>
        </View>
      );
    }
    let cancelButton = this.props.navigation.getParam('closable', false) ?
    (<View style={styles.signElement}>
      <TouchableOpacity
        onPress={() => this.props.navigation.goBack(null)}
      >
        <Text style={styles.signButton}>取消</Text>
      </TouchableOpacity>
    </View>) : null;
    let accAutoFocus = false;
    if (this.state.accAutoFocus) {
      this.setState({ accAutoFocus: false });
      accAutoFocus = true;
    }
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <View style={styles.signElement}>
              <Text sytle={styles.signLabel}>
                学校
              </Text>
              <TouchableOpacity onPress={() => this.setState({showSchools: true})} >
                <TextInput
                  style={styles.signInput} 
                  editable={false}
                  value={this.state.schoolName}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.signElement}>
              <Text sytle={styles.signLabel}>
                账号
              </Text>
              <TextInput
                ref='account'
                autoFocus={accAutoFocus}
                style={styles.signInput} 
                value={this.state.account}
                onChangeText={(text) => this.setState({ account: text })}
                onSubmitEditing={() => this.refs.password.focus()}
                returnKeyType='next'
              />
            </View>
            <View style={styles.signElement}>
              <Text sytle={styles.signLabel}>
                密码
              </Text>
              <TextInput
                ref='password'
                secureTextEntry={true}
                style={styles.signInput} 
                value={this.state.password}
                onChangeText={(text) => this.setState({ password: text })}
                onSubmitEditing={this.sign}
                returnKeyType='send'
              />
            </View>
            <View style={styles.signElement}>
              <TouchableOpacity
                onPress={this.sign}
              >
                <Text style={styles.signButton}>登录</Text>
              </TouchableOpacity>
            </View>
            {cancelButton}
          </View>
        </ScrollView>
      </View>
    );
  }
  onBackButtonPressAndroid = () => {
    return true;
  }

  chooseSchool = (item) => {
    let accAutoFocus = this.state.schoolId == 0;
    this.setState({
      schoolId: item.id,
      schoolName: item.name,
      showSchools: false,
      accAutoFocus: accAutoFocus,
    });
  }

  sign = () => {
    if (this.state.posting) {
      return;
    }
    if (this.state.schoolId == 0) {
      CommonAlert.alert('提示：', '请选择学校');
      return;
    }
    if (this.state.account == '') {
      CommonAlert.alert('提示：', '请输入账号');
      return;
    }
    if (this.state.password == '') {
      CommonAlert.alert('提示：', '请输入密码');
      return;
    }
    this.setState({ posting: true });
    Ajax.send(Uri.userAuth.method, Uri.userAuth.uri, {
      schoolId: this.state.schoolId,
      account: this.state.account,
      password: this.state.password,
      signature: this.state.signature,
      others: this.state.others,
    })
    .then((rst) => {
      CommonAlert.alert('好棒！', '登录成功');
      Store.set('signature', rst)
      .then(
        () => {
          this.setState({ posting: false });
          Common.goBack(this);
        }
      )
    })
    .catch((error) => {
      CommonAlert.alert('登录失败', '请检查账号密码（使用教务系统账号密码）');
      this.setState({ posting: false });
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 30,
    marginRight: 30,
  },
  schoolElement: {
    fontSize: 20,
    padding: 3,
    textAlign: 'center',
    width: Dimensions.get('window').width- 120,
    borderColor: 'gray',
    borderBottomWidth: 1,
    padding: 5,
    marginLeft: 30
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
    height: 40,
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
  cancelSchool: {
    marginTop: 2,
    marginBottom: 3,
    fontSize: 25,
    padding: 5,
    textAlign: 'center',
    borderColor: 'white',
    borderWidth: 1,
    padding: 3,
  }
});