import React from 'react';
import {AsyncStorage} from 'react-native'
import Uuid from 'react-native-uuid'
import axios from 'axios';
import SafeArea from "react-native-safe-area";
// @ts-ignore
import GetLocation from 'react-native-get-location';

import {
  Criteria,
  LikeStatus,
  WeatherPeriod,
  GlobalState,
  ByPointsData,
  ForecastData,
  Location,
} from '../types';

import {
  DEFAULT_HI,
  DEFAULT_LO,
  DEFAULT_LOC,
  DUMMY_DAYS,
} from "../data";

const GlobalContext = React.createContext({});


export class GlobalContextProvider extends React.Component<any, GlobalState> {
  constructor(props: any) {
    super(props);
    this.state = new GlobalState()
  }

  toClass = (obj: any, proto: object) => {
    obj.__proto__ = proto;
    return obj;
  }

  appInit = async() => {
    let { safeAreaInsets } = await SafeArea.getSafeAreaInsetsForRootView();
    this.setState({
      safeAreaInsets
    })
    // LOAD
    let stored = await this.loadSavedState();
    // SET
    let periods: WeatherPeriod[] = (stored.periods || [])
      .map(v => this.toClass(v, WeatherPeriod.prototype));
    let criteriaList: Criteria[] = (stored.criteriaList || [])
      .map(v => this.toClass(v, Criteria.prototype));
    let currCriteria: Criteria = Object.assign(new Criteria(), stored.currCriteria);
    let history = (stored.history || [])
      .map(v => this.toClass(v, WeatherPeriod.prototype));
    history = this.doDummies(history, 'rem');
    // console.log(history);
    this.setPredictions(periods, history);

    this.setState({
      periods,
      currCriteria,
      criteriaList,
      history
    });

    setTimeout(async () => {
      await this.requestLocation(history);
    }, 250);
  }

  doDummies = (history: WeatherPeriod[], action: string) => {
    let dummies = DUMMY_DAYS
      .map((p: any) => new WeatherPeriod(p))
      .filter(p => p.isDaytime);
    if (action == 'add') {
      history = [...history, ...dummies]
    } else if (action == 'rem') {
      let dates = dummies.map(d => d.date);
      history = history.filter(h => !dates.includes(h.date));
    }
    return history;
  }

  adjustDummyHistory = async (isDummyHistoryOn: boolean): Promise<void> => {
    let {history, periods} = this.state;
    history = this.doDummies(history, isDummyHistoryOn ? 'rem' : 'add');
    this.setPredictions(periods, history);
    this.setState({
      history,
      periods
    })
    await this.saveDaysInfoState(periods, history);
  }

  loadSavedState = async () => {
    let ret = new GlobalState();
    try {
      ret.currCriteria = JSON.parse(
        await AsyncStorage.getItem('curr') as string) || ret.currCriteria;
      ret.currCriteria.uuid = Uuid.v1();
      ret.periods = JSON.parse(
        await AsyncStorage.getItem('periods') as string) || ret.periods;
      ret.criteriaList = JSON.parse(
        await AsyncStorage.getItem('criteriaList') as string) || ret.criteriaList;
      ret.history = JSON.parse(
        await AsyncStorage.getItem('history') as string) || ret.history;

      // alert(JSON.stringify(ret.history));
    } catch (error) {
    }
    return ret;
  }

  saveDaysInfoState = async (periods: WeatherPeriod[], history: WeatherPeriod[]) => {

    try {
      await AsyncStorage.setItem(
        'periods', JSON.stringify(periods));
      await AsyncStorage.setItem(
        'history', JSON.stringify(history));
    } catch (error) {
    }
  };

  setPredictions = (periods: WeatherPeriod[], history: WeatherPeriod[]) => {
    if (periods.length > 0) {
      for (let p of periods) {
        p.setPredictedGoodness(history);
      }
    }
  }

  // getTodayName = (current): string => {
  //   let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  //   let d = new Date();
  //   let today = days[d.getDay()];
  //   if (days.includes(current) && current != today) {
  //     return current + ' (Tomorrow)'
  //   } else {
  //     return today;
  //   }
  // }

  processFreshForecastData = (dataFc: ForecastData): WeatherPeriod[] => {
    let periods = dataFc.data.properties.periods
      .map((p: any) => new WeatherPeriod(p))
      .filter(p => p.isDaytime);
    periods[0].pData.name = periods[0].realName;
    periods.forEach((v, i, a) => {
      if (v.isRainy && i < a.length - 1) {
        a[i + 1].wasYesterdayRainy = true;
      }
    })
    return periods;
  }

  fetchData = async (location: Location, history: WeatherPeriod[]) => {
    location = location || DEFAULT_LOC;
    let long = location.longitude.toFixed(1);
    let lat = location.latitude.toFixed(1);
    let url = `https://api.weather.gov/points/${lat},${long}`;
    let data: ByPointsData = await axios.get(url);
    let forecastUrl = data.data.properties.forecast;
    let dataFc: ForecastData = await axios.get(forecastUrl);
    let periods = this.processFreshForecastData(dataFc);
    this.syncTodayLikeWithHistory(periods, history);
    this.setPredictions(periods, history);
    let {city, state} = data.data.properties.relativeLocation.properties;
    this.setState({
      location,
      periods,
      loading: false,
      city: `${city}, ${state}`,
    });
  }

  syncTodayLikeWithHistory = (periods: WeatherPeriod[], history: WeatherPeriod[]) => {
    if (periods.length > 0 && history.length > 0) {
      let alreadyThere = history[0];
      if (periods[0].date == alreadyThere.date) {
        periods[0] = alreadyThere;
      }
    }
  }

  addCriteria = async () => {
    let cc = this.state.currCriteria;
    let min = parseFloat(String(cc.minGoodTemp) || DEFAULT_LO);
    let max = parseFloat(String(cc.maxGoodTemp) || DEFAULT_HI);
    if (min > max) {
      cc.minGoodTemp = max;
      cc.maxGoodTemp = min;
    }
    cc.maxWind = parseFloat(cc.maxWind || '100');
    this.setState({
      criteriaList: [cc, ...this.state.criteriaList],
      currCriteria: Criteria.fromOther(cc)
    })
    await this.saveCriteria();
  }

  delCriteria = async (uuid: string) => {
    let criteriaList = this.state.criteriaList
      .filter(v => v.uuid !== uuid);
    this.setState({
      criteriaList
    });
    await this.saveCriteria();
  }

  saveCriteria = async () => {
    await AsyncStorage.setItem(
      'curr', JSON.stringify(this.state.currCriteria));
    await AsyncStorage.setItem(
      'criteriaList', JSON.stringify(this.state.criteriaList));
  }

  requestLocation = async (history: WeatherPeriod[]) => {
    this.setState({
      loading: true,
      location: {latitude: 0, longitude: 0}
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
    await this.fetchData(location, history);
  }

  onChangeRain = (which: string) => {
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

  onLikeAdjustHistory = (fst: WeatherPeriod, history: WeatherPeriod[]): WeatherPeriod[] => {
    let existing = history.find(h => h.date == fst.date);
    if (!existing) {
      history = [fst, ...history];
    } else {
      if (fst.likedStatus == LikeStatus.NEUTRAL ) {
        let d = existing.date || '';
        history = history.filter(h => h.date !== d);
      } else {
        existing.likedStatus = fst.likedStatus;
      }
    }
    return history;
  }

  onThumbButtonPress = async (which: LikeStatus): Promise<void> => {
    let { periods, history } = this.state;
    if (periods.length == 0) return;
    const fst = periods[0];
    fst.changeLikeStatus(which);
    history = this.onLikeAdjustHistory(fst, history);
    this.setPredictions(periods, history);
    this.setState({
      history,
      periods
    })
    await AsyncStorage.setItem('history', JSON.stringify(history));
  }

  onChangeCriteriaTxtBox = (t: string, which: string) => {
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

  render () {
    const {children} = this.props;
    return (
      <GlobalContext.Provider
        value={{
          ...this.state,
          saveState: this.saveDaysInfoState,
          saveCriteria: this.saveCriteria,
          loadSavedState: this.loadSavedState,
          onChangeCriteriaTxtBox: this.onChangeCriteriaTxtBox,
          onChangeRain: this.onChangeRain,
          addCriteria: this.addCriteria,
          delCriteria: this.delCriteria,
          appInit: this.appInit,
          onThumbButtonPress: this.onThumbButtonPress,
          onDummyHistoryPressed: this.adjustDummyHistory
        }}
      >
        {children}
      </GlobalContext.Provider>
    )
  }
}

// create the consumer as higher order component
export const withGlobalContext = (ChildComponent: any) => (props: any) => (
  <GlobalContext.Consumer>
    {
      context => <ChildComponent {...props} global={context}  />
    }
  </GlobalContext.Consumer>
);
