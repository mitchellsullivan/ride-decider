import React from 'react';
import {Criteria, DEFAULT_HI, DEFAULT_LO, DEFAULT_LOC, WeatherPeriod} from './models'
import {AsyncStorage} from 'react-native'
import Uuid from 'react-native-uuid'
import axios from 'axios'
import GetLocation from 'react-native-get-location'

const GlobalContext = React.createContext({});

export class GlobalContextProvider extends React.Component {
  state = {
    currCriteria: new Criteria(),
    criteriaList: [],
    periods: [],
    loading: false,
    history: []
  }
  
  toClass = (obj, proto) => {
    obj.__proto__ = proto;
    return obj;
  }
  
  appInit = async() => {
    let stored = await this.loadSavedState();
    let periods = (stored.periods || [])
      .map(v => this.toClass(v, WeatherPeriod.prototype));
    let criteriaList = (stored.criteriaList || [])
      .map(v => this.toClass(v, Criteria.prototype));
    let currCriteria = Object.assign(
      new Criteria,
      stored.currCriteria);
    this.setState({
      periods,
      currCriteria,
      criteriaList
    });
    setTimeout(async () => {
      await this.requestLocation();
    }, 1000);
  }
  
  loadSavedState = async () => {
    let ret = {
      currCriteria: new Criteria(),
      criteriaList: [],
      periods: [],
      history: [],
      loading: false
    }
    try {
      ret.currCriteria = JSON.parse(
        await AsyncStorage.getItem('curr')) || ret.currCriteria;
      ret.currCriteria.uuid = Uuid.v1();
      ret.periods = JSON.parse(
        await AsyncStorage.getItem('periods')) || ret.periods;
      ret.criteriaList = JSON.parse(
        await AsyncStorage.getItem('criteriaList')) || ret.criteriaList;
      // ret.history = JSON.parse(
      //   await AsyncStorage.getItem('history')) || ret.history;
    } catch (error) {
    }
    // alert(JSON.stringify(ret));
    return ret;
  }
  
  saveState = async () => {
    try {
      await AsyncStorage.setItem(
        'curr', JSON.stringify(this.state.currCriteria));
      await AsyncStorage.setItem(
        'periods', JSON.stringify(this.state.periods));
      await AsyncStorage.setItem(
        'criteriaList', JSON.stringify(this.state.criteriaList));
      await AsyncStorage.setItem(
        'history', JSON.stringify(this.state.history)
      )
    } catch (error) {
    }
  };
  
  onChangeTemp = (t, which) => {
    let currCriteria = this.state.currCriteria;
    if (which === 'hi') {
      currCriteria.maxGoodTemp = t;
    } else if (which === 'lo') {
      currCriteria.minGoodTemp = t;
    } else if (which === 'mw') {
      currCriteria.maxWind = t;
    }
    this.setState({
      currCriteria
    })
  }
  
  populate = async (location) => {
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
    if (periods.length === 0) {
      periods = this.state.periods
    }
    this.setState({
      location,
      periods,
      loading: false,
    });
  }
  
  addCriteria = async () => {
    let cc = this.state.currCriteria;
    let min = parseFloat(cc.minGoodTemp || DEFAULT_LO);
    let max = parseFloat(cc.maxGoodTemp || DEFAULT_HI);
    if (min > max) {
      cc.minGoodTemp = max;
      cc.maxGoodTemp = min;
    }
    cc.maxWind = parseFloat(cc.maxWind);
    let criteriaList = [...this.state.criteriaList, cc];
    let next = new Criteria(
      cc.minGoodTemp,
      cc.maxGoodTemp,
      cc.rainOkay,
      cc.prevDayRainOkay,
      cc.maxWind
    );
    this.setState({
      criteriaList,
      currCriteria: next
    })
    await this.saveState();
  }
  
  delCriteria = (uuid) => {
    let criteriaList = this.state.criteriaList
      .filter(v => v.uuid !== uuid);
    this.setState({
      criteriaList
    });
    this.saveState();
  }
  
  requestLocation = async () => {
    this.setState({
      loading: true,
      location: null
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
  
  onChangeRain = (which) => {
    let curr = this.state.currCriteria;
    if (which === 'curr') {
      curr.rainOkay = !curr.rainOkay;
      if (curr.rainOkay) {
        curr.prevDayRainOkay = true;
      }
    } else if (which === 'prev') {
      curr.prevDayRainOkay = !curr.prevDayRainOkay;
    }
    this.setState({
      currCriteria: curr,
    })
  }
  
  onRate = (rating) => {
    let {periods, history} = this.state;
    let fst = periods[0];
    fst.userRating = rating;
    let existing = history
      .find(h => h.date === fst.date);
    if (!existing) {
      history = [...history, fst];
    } else {
      existing.userRating = rating;
    }
    if (rating === -1) {
      history = history.filter((h) => h !== existing);
    }
    this.setState({
      history,
      periods,
    })
  }
  
  render () {
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          saveState: this.saveState,
          loadSavedState: this.loadSavedState,
          onChangeTemp: this.onChangeTemp,
          onChangeRain: this.onChangeRain,
          curr: this.state.currCriteria,
          criteriaList: this.state.criteriaList,
          addCriteria: this.addCriteria,
          periods: this.state.periods,
          loading: this.state.loading,
          requestLocation: this.requestLocation,
          delCriteria: this.delCriteria,
          onRate: this.onRate,
          history: this.state.history,
          appInit: this.appInit
        }}
      >
        {this.props.children}
      </GlobalContext.Provider>
    )
  }
}

// create the consumer as higher order component
export const withGlobalContext = ChildComponent => props => (
  <GlobalContext.Consumer>
    {
      context => <ChildComponent {...props} global={context}  />
    }
  </GlobalContext.Consumer>
);