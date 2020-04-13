import React from 'react';
import {
  AsyncStorage,
  StatusBar,
} from 'react-native'
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
import {Criterium, DEFAULT_HI, DEFAULT_LO, DEFAULT_LOC, WeatherPeriod} from './Components/models'
import axios from 'axios'
import GetLocation from 'react-native-get-location'

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
          iconName = `home`;
        } else if (routeName === 'Criteria') {
          iconName = `plus-square`;
        }
        let color = focused ? 'cyan' : 'black';
        
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

export default class App extends React.Component {
  state = {
    criteria: new Criterium(),
    periods: [],
    loading: false
  }
  
  async componentDidMount(): void {
    let stored = await this._retrieveCriteria();
    // alert(JSON.stringify(stored));
    let criteria = new Criterium(stored.minGoodTemp,
      stored.maxGoodTemp,
      stored.prevDayRainOkay,
      stored.rainOkay);
    this.setState({
      criteria
    });
    await this._requestLocation();
  }
  
  _retrieveCriteria = async () => {
    let ret = {
      minGoodTemp: parseFloat(DEFAULT_LO),
      maxGoodTemp: parseFloat(DEFAULT_HI),
      prevDayRainOkay: true,
      rainOkay: false
    }
    try {
      let stored = await AsyncStorage.getItem('crit');
      if (stored) {
        ret = JSON.parse(stored);
      }
    } catch (error) {
    }
    return ret;
  }
  
  _saveCriteria = async () => {
    let criteria = this.state.criteria;
    criteria.minGoodTemp = parseFloat(criteria.minGoodTemp || DEFAULT_LO);
    criteria.maxGoodTemp = parseFloat(criteria.maxGoodTemp || DEFAULT_HI);
    if (criteria.maxGoodTemp < criteria.minGoodTemp) {
      // alert(`yup ${JSON.stringify(criteria)}`)
      let swap = criteria.minGoodTemp;
      criteria.minGoodTemp = criteria.maxGoodTemp;
      criteria.maxGoodTemp = swap;
    }
    try {
      await AsyncStorage.setItem('crit', JSON.stringify({
        minGoodTemp: criteria.minGoodTemp,
        maxGoodTemp: criteria.maxGoodTemp,
        prevDayRainOkay: criteria.prevDayRainOkay,
        rainOkay: criteria.rainOkay
      }));
    } catch (error) {
      // Error saving data
    }
    this.setState({
      criteria,
    });
  };
  
  onChangeTemp = (t, which) => {
    let criteria = this.state.criteria;
    if (which === 'hi') {
      criteria.maxGoodTemp = t;
    } else {
      criteria.minGoodTemp = t;
    }
    this.setState({
      criteria
    })
  }
  
  populate = async (location) => {
    alert(JSON.stringify(location));
    location = location || DEFAULT_LOC;
    let long = (location['longitude'] || 0).toFixed(1);
    let lat = (location['latitude'] || 0).toFixed(1);
    let url = `https://api.weather.gov/points/${lat},${long}`;
    let data = await axios.get(url);
    let forecastUrl = data['data']['properties']['forecast'];
    let dataFc = await axios.get(forecastUrl);
    let periods = dataFc['data']['properties']['periods']
      .map(p => new WeatherPeriod(p))
      .filter(p => p.isDaytime)
    periods.forEach((v, i, a) => {
      if (v.isRainy && i < a.length - 1) {
        a[i + 1].wasYesterdayRainy = true;
      }
    })
    this.setState({
      location,
      periods,
      loading: false,
    });
  }
  
  _requestLocation = async () => {
    this.setState({
      loading: true,
      location: null,
      periods: []
    });
    let location = null;
    try {
      location = await GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 5000,
      });
    } catch ({code, message}) {
      this.setState({
        loading: false,
      });
    }
    await this.populate(location);
  }
  
  render() {
    return (
      <>
        <StatusBar barStyle='dark-content' />
        <AppContainer
          screenProps={{
            saveCriteria: this._saveCriteria,
            retrieveCriteria: this._retrieveCriteria,
            onChangeTemp: this.onChangeTemp,
            criteria: this.state.criteria,
            periods: this.state.periods,
            loading: this.state.loading,
            requestLocation: this._requestLocation
          }}/>
      </>
    )
  }
}

