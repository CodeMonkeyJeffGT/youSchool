import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';

import HomeScreen from '../screens/HomeScreen';
import ScoreScreen from '../screens/ScoreScreen';
import LessonScreen from '../screens/LessonScreen';
import ExamScreen from '../screens/ExamScreen';

import ForumScreen from '../screens/ForumScreen';
import ColumnsScreen from '../screens/ColumnsScreen';
import PagesScreen from '../screens/PagesScreen';

import MessageScreen from '../screens/MessageScreen';
import MessageDetailScreen from '../screens/MessageDetailScreen';

import MeScreen from '../screens/MeScreen';
import DetailScreen from '../screens/DetailScreen';
import CollectsScreen from '../screens/CollectsScreen';
import FollowsScreen from '../screens/FollowsScreen';
import FollowedScreen from '../screens/FollowedScreen';
import MyPagesScreen from '../screens/MyPagesScreen';

import IconsScreen from '../screens/IconsScreen';

import SignScreen from '../screens/SignScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
  Score: ScoreScreen,
  Lesson: LessonScreen,
  Exam: ExamScreen,
});

const ForumStack = createStackNavigator({
  Forum: ForumScreen,
  Columns: ColumnsScreen,
  Pages: PagesScreen,
});

const MessageStack = createStackNavigator({
  Message: MessageScreen,
  MessageDetail: MessageDetailScreen,
});

const MesStack = createStackNavigator({
  Me: MeScreen,
  Detail: DetailScreen,
  Collects: CollectsScreen,
  Follows: FollowsScreen,
  Followed: FollowedScreen,
  MyPages: MyPagesScreen,
});

const IconsStack = createStackNavigator({
  Icons: IconsScreen,
});

const ModalStack = createStackNavigator(
  {
    Sign: SignScreen,
  },
  {
    defaultNavigationOptions: {
    },
  },
);

HomeStack.navigationOptions = {
  tabBarLabel: '功能',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? `ios-menu` : 'md-menu'}
    />
  ),
};

ForumStack.navigationOptions = {
  tabBarLabel: '论坛',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-people' : 'md-people'}
    />
  ),
};

MessageStack.navigationOptions = {
  tabBarLabel: '消息',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-chatboxes' : 'md-chatboxes'}
    />
  ),
};

MesStack.navigationOptions = {
  tabBarLabel: '我',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'}
    />
  ),
};

IconsStack.navigationOptions = {
  tabBarLabel: '图标库',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-bug' : 'md-bug'}
    />
  ),
};

const bottomTabNavigator = createBottomTabNavigator({
  HomeStack,
  ForumStack,
  MessageStack,
  MesStack,
  IconsStack,
});

export default createStackNavigator(
  {
    Main: bottomTabNavigator,
    Modal: ModalStack,
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);
