import React from 'react';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  HomeScreen, HistoryScreen, CriteriaScreen, StatusScreen
} from './screens';
import IconWithBadge from './IconWithBadge';

import {withGlobalContext} from './GlobalContext';
import {StatusBar, View} from "react-native";

const Tab = createBottomTabNavigator();

class AppContainer extends React.Component<any> {
  render() {
    const {safeAreaInsets} = this.props.global;

    const tabBarOptions = {
      activeBackgroundColor: 'black',
      inactiveBackgroundColor: 'black',
      showLabel: false,
      keyboardHidesTabBar: false,
      style:{
        borderBottomWidth: 0,
        borderTopWidth: 0.25,
        borderTopColor: 'gray'
      }
    }

    const screenOpts = ({route}: any) => {
      return {
        tabBarIcon: ({focused, color, size}: any) => {
          let icons: { [key: string]: string } = {
            'Home': 'home',
            'Criteria': 'plus-square',
            'History': 'clock',
            'Status': 'info',
          }
          let iconName = icons[route.name] || 'frown';
          let colour = focused ? 'cyan' : '#eee';
          return (
            <IconWithBadge name={iconName} badgeCount={0} color={colour} size={28}/>
          )
        },
      }
    }



    return (
      <>
        <StatusBar hidden={false} barStyle={'light-content'}/>
        <View style={{backgroundColor: '#111', height: safeAreaInsets.top}}/>
        <NavigationContainer>
          <Tab.Navigator screenOptions={(r) => screenOpts(r)}
             tabBarOptions={tabBarOptions}>
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Criteria" component={CriteriaScreen}/>
            <Tab.Screen name="History" component={HistoryScreen}/>
            <Tab.Screen name="Status" component={StatusScreen}/>
          </Tab.Navigator>
          <View style={{backgroundColor: '#111', height: safeAreaInsets.bottom}}/>
        </NavigationContainer>
      </>
    )
  }
}

export default withGlobalContext(AppContainer);
