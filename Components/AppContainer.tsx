import React from 'react';

import {
    NavigationContainer
} from '@react-navigation/native';

import {
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';

import {
    HomeScreen, RatingsScreen, CriteriaScreen
} from './Screens';
import IconWithBadge from './IconWithBadge';

import {withGlobalContext} from './GlobalContext';
import {StatusBar, View} from "react-native";

const Tab = createBottomTabNavigator();

class AppContainer extends React.Component<any> {
    render() {
        const {safeAreaInsets} = this.props.global;

        return (
            <>
                <StatusBar hidden={false} barStyle={'light-content'}/>
                <View style={{
                    backgroundColor: '#111',
                    height: safeAreaInsets.top
                }}/>
                <NavigationContainer>
                    <Tab.Navigator screenOptions={({route}) => ({
                        tabBarIcon: ({focused, color, size}) => {
                            let iconName: string = '';
                            if (route.name === 'Home') {
                                iconName = `home`;
                            } else if (route.name === 'Criteria') {
                                iconName = `plus-square`;
                            } else if (route.name === 'Ratings') {
                                iconName = `clock`;
                            }
                            let colour = focused ? 'cyan' : '#eee';

                            return (
                                <IconWithBadge name={iconName}
                                               badgeCount={0}
                                               color={colour}
                                               size={28}/>
                            )
                        },
                    })}
                   tabBarOptions={{
                       activeBackgroundColor: 'black',
                       inactiveBackgroundColor: 'black',
                       showLabel: false,
                       keyboardHidesTabBar: false,
                       style:{
                           borderBottomWidth: 0,
                           borderTopWidth: 0.25,
                           borderTopColor: 'gray'
                       }
                   }}>
                        <Tab.Screen name="Home" component={HomeScreen}/>
                        <Tab.Screen name="Criteria" component={CriteriaScreen}/>
                        <Tab.Screen name="Ratings" component={RatingsScreen}/>
                    </Tab.Navigator>
                    <View style={{
                        backgroundColor: '#111',
                        height: safeAreaInsets.bottom
                    }}/>
                </NavigationContainer>
            </>
        )
    }
}

export default withGlobalContext(AppContainer);
