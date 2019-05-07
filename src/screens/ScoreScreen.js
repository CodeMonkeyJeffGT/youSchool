import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

export default class extends React.Component {
  static navigationOptions = {
    title: '成绩',
  };

  state = {

  }

  render() {
    return (
    <View>
      <TouchableOpacity
        onPress={() => this.props.navigation.goBack(null)}
      >
        <Text>取消</Text>
      </TouchableOpacity>
    </View>
    );
  }

}