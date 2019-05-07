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
import { withNavigation } from 'react-navigation';

import Common from '../components/Common';
import Ajax from '../components/Ajax';
import Uri from '../constants/Uri';
import CommonAlert from '../components/CommonAlert';
import Store from '../components/Store'

class Sign extends React.Component {
  static navigationOptions = {
    title: '登录',
  };

  constructor(props) {
    super(props);
    BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid);
  }

  state = {
    showSchools: false,
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
    ],
  }

  render() {
    if (this.state.showSchools) {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.welcomeContainer}>
              <FlatList 
                data={this.state.schoolsList}
                keyExtractor={item => item.id + ''}
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
                style={styles.signInput} 
                value={this.state.account}
                onChangeText={(text) => this.setState({ account: text })}
              />
            </View>
            <View style={styles.signElement}>
              <Text sytle={styles.signLabel}>
                密码
              </Text>
              <TextInput
                secureTextEntry={true}
                style={styles.signInput} 
                value={this.state.password}
                onChangeText={(text) => this.setState({ password: text })}
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
    this.setState({ schoolId: item.id });
    this.setState({ schoolName: item.name });
    this.setState({ showSchools: false });
  }

  sign = () => {
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
    Ajax.send(Uri.sign.method, Uri.sign.uri, {
      schoolId: this.state.schoolId,
      account: this.state.account,
      password: this.state.password,
      signature: this.state.signature,
      others: this.state.others,
    })
    .then((rst) => {
      CommonAlert.alert('好棒！', '登录成功');
      Store.set('signature', rst.data);
      Common.goBack(this);
    })
    .catch((error) => {
      CommonAlert.error();
    });
  }
}

export default withNavigation(Sign);
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
    width: Dimensions.get('window').width- 60,
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
});