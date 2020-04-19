import React from 'react';

import {
  NavigationContainer
} from '@react-navigation/native';

import {
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
  Criteria
} from './Components/models';

import {
  StatusBar
} from 'react-native';

import HomeScreen from './Components/Screens/HomeScreen';
import IconWithBadge from './Components/IconWithBadge';
import CriteriaScreen from './Components/Screens/CriteriaScreen';
import RatingsScreen from './Components/Screens/RatingsScreen';

import {GlobalContextProvider} from './Components/GlobalContext';

const Tab = createBottomTabNavigator();

export default class App extends React.Component {
  render() {
    return (
      <GlobalContextProvider>
        <NavigationContainer>
          <Tab.Navigator screenOptions={({route}) => ({
              tabBarIcon: ({focused, color, size}) => {
                let iconName;
                if (route.name === 'Home') {
                  iconName = `home`;
                } else if (route.name === 'Criteria') {
                  iconName = `plus-square`;
                } else if (route.name === 'Ratings') {
                  iconName = `clock`;
                }
                let colour = focused ? '#00b7ff' : 'dimgray';
        
                return (
                  <IconWithBadge name={iconName}
                                 badgeCount={0}
                                 color={colour}
                                 size={24}/>
                )
              },
            })}
            tabBarOptions={{
              activeBackgroundColor: 'white',
              inactiveBackgroundColor: 'white',
              showLabel: false,
            }}>
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="Criteria" component={CriteriaScreen}/>
            <Tab.Screen name="Ratings" component={RatingsScreen}/>
          </Tab.Navigator>
        </NavigationContainer>
      </GlobalContextProvider>
    )
  }
}

