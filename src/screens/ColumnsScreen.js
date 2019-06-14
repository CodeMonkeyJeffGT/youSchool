import React from 'react';
import { ExpoConfigView } from '@expo/samples';

export default class extends React.Component {
  static navigationOptions = {
    title: '版块详情',
  };

  render() {
    return <ExpoConfigView />;
  }
}
