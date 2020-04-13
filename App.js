import React from 'react';
import {
  StatusBar,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  createAppContainer
} from 'react-navigation';

import {
  createStackNavigator,
} from 'react-navigation-stack';

import {
  createBottomTabNavigator,
} from 'react-navigation-tabs';

import HomeScreen from './Components/Screens/HomeScreen';
import IconWithBadge from './Components/IconWithBadge';
import CriteriaScreen from './Components/Screens/CriteriaScreen'

const TabStack = createBottomTabNavigator(
  {
    Home: HomeScreen,
    Criteria: CriteriaScreen
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          // iconName = `ios-information-circle${focused ? '' : '-outline'}`;
          iconName = `home`;
        } else if (routeName === 'Criteria') {
          iconName = `plus-square`;
        }
        // else if (routeName === 'Profile') {
        //   iconName = `user`;
        // }
        let color = focused ? 'blue' : 'black';
        
        return (
          <>
            <IconWithBadge name={iconName}
                           badgeCount={0}
                           color={color}
                           size={24}/>
          </>
        )
      },
    }),
    tabBarOptions: {
      activeTintColor: 'blue',
      inactiveTintColor: 'white',
      showLabel: false,
    },
  },
)

const MainStack = createStackNavigator(
  {
    Home: { screen: TabStack },
  },
  {
    initialRouteName: 'Home',
    headerMode: 'none',
  }
)

const AppContainer = createAppContainer(MainStack);

export default App = () => {
  return (
    <>
      <StatusBar barStyle='dark-content' />
      <AppContainer />
    </>
  )
}

