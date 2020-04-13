import React, {Component} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  AsyncStorage,
  CheckBox,
  Switch, StatusBar
} from 'react-native'
import axios from 'axios';
import GetLocation from 'react-native-get-location';
import {byPoints} from '../data/forecast';
import {styles} from '../Styles';

const DEFAULT_LOC = {
  longitude : byPoints.data.geometry.coordinates[0],
  latitude : byPoints.data.geometry.coordinates[1]
}

const DEFAULT_HI = '72';
const DEFAULT_LO = '60';

export default class MainStuff extends Component {
  state = {
    periods: [],
    loading: false,
    criteria: new Criterium()
  }
  
  async componentDidMount(): void {
    let stored = await this._retrieveCriteria();
    // alert(JSON.stringify(stored));
    let criteria = new Criterium(stored.minGoodTemp,
      stored.maxGoodTemp,
      stored.prevDayRainOkay,
      stored.rainOkay);
    // alert(JSON.stringify(criteria));
    this.setState({
      criteria
    });
    this._requestLocation();
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
    this.setState({
      location,
      periods,
      loading: false,
    });
  }
  
  _requestLocation = () => {
    this.setState({
      loading: true,
      location: null,
      periods: []
    });
    setTimeout(async () => {
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
      this.populate(location);
    }, 250);
  }
  
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
    criteria.minGoodTemp = parseFloat(criteria.minGoodTemp);
    criteria.maxGoodTemp = parseFloat(criteria.maxGoodTemp);
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
  
  renderItem(item: WeatherPeriod) {
    const color = this.state.criteria.ratePeriodColor(item);
    return (
      <TouchableOpacity onPress={() => alert(item.name)}>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text>
            {item.getDisplayString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  render() {
    const { periods, loading, criteria } = this.state;
    let days = periods
    return (
      <KeyboardAvoidingView style={styles.container}
                            behavior='padding'>
        <View style={styles.topSpace}/>
        <View style={[styles.headingView, {flexDirection: 'row', marginBottom: 5}]}>
          <View style={{flex: 1}}>
            <View style={styles.buttView}>
              <TouchableOpacity onPress={this._requestLocation} disabled={loading}>
                <View style={styles.butt}>
                  <Text style={styles.buttText}>Refresh</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.headingText}>
              Ride Decide
            </Text>
          </View>
          <View style={{flex: 1}}>
            {loading ?
              <ActivityIndicator style={{paddingBottom: 10, height: 40}}/> : null}
          </View>
        </View>
        {!days || days.length === 0 ? (
          <View style={{flex: 0.75, backgroundColor: 'lightgray', width: 350}}>
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 20}}>
              (No data.)
            </Text>
          </View>
        ) : (
          <View style={styles.listView}>
            <FlatList
              style={styles.scroll}
              data={days}
              renderItem={({item}) => this.renderItem(item)}
              keyExtractor={item => item.idx}
            />
          </View>
        )}
        <View style={styles.boxView}>
          <View style={{flexDirection:"row"}}>
            <View style={{flex: 0.5}}>
              <Text>Lo Good Temp (F)</Text>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={async () => {
                           Keyboard.dismiss();
                           await this._saveCriteria();
                         }}
                         onChangeText={(text) => this.onChangeTemp(text, 'lo')}
                         value={String(criteria.minGoodTemp)}
                         style={[styles.tempBox, {justifyContent: 'flex-start'}]}
                         maxLength={3}/>
            </View>
            <View style={{flex: 0.5}}>
              <Text>Hi Good Temp (F)</Text>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={async () => {
                           Keyboard.dismiss();
                           await this._saveCriteria();
                         }}
                         onChangeText={text => this.onChangeTemp(text, 'hi')}
                         value={String(criteria.maxGoodTemp)}
                         style={[styles.tempBox, {justifyContent: 'flex-end'}]}
                         maxLength={3}/>
            </View>
          </View>
          <View style={{flexDirection:"row"}}>
            <View style={{flex: 1, marginTop: 5}}>
              <Text>Rain Today OK</Text>
              <Switch
                style={{marginTop: 5}}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=>{
                  this.state.criteria.rainOkay =
                    !this.state.criteria.rainOkay;
                  this._saveCriteria();
                }}
                value={this.state.criteria.rainOkay}
              />
            </View>
            <View style={{flex: 1, marginTop: 5}}>
              <Text>Rain Yesterday OK</Text>
              <Switch
                style={{marginTop: 5}}
                ios_backgroundColor="#3e3e3e"
                onValueChange={()=>{
                  this.state.criteria.prevDayRainOkay =
                    !this.state.criteria.prevDayRainOkay;
                  this._saveCriteria();
                }}
                value={this.state.criteria.prevDayRainOkay}
              />
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}


class Criterium {
  maxGoodTemp: number;
  minGoodTemp: number;
  rainOkay: boolean;
  prevDayRainOkay: boolean;
  
  constructor(minGoodTemp: number = parseFloat(DEFAULT_LO),
              maxGoodTemp: number = parseFloat(DEFAULT_HI),
              rainOkay: boolean = false,
              prevDayRainOkay: boolean = true) {
    this.minGoodTemp = minGoodTemp;
    this.maxGoodTemp = maxGoodTemp;
    this.rainOkay = rainOkay;
    this.prevDayRainOkay = prevDayRainOkay;
  }
  
  compTemperature(period: WeatherPeriod): number {
    if (period.temp >= this.minGoodTemp && period.temp <= this.maxGoodTemp)
      return 0;
    else if (period.temp > this.maxGoodTemp) return 1;
    else if (period.temp < this.minGoodTemp) return -1;
  }
  
  compRain(period: WeatherPeriod): number {
    if (!period.wasYesterdayRainy && !period.isRainy) return 0;
    else if (period.wasYesterdayRainy && !this.prevDayRainOkay) return -1;
    else if (period.isRainy && !this.rainOkay) return 1;
  }
  
  ratePeriodColor(period: WeatherPeriod): string {
    let color = 'white'
    switch (this.compTemperature(period)) {
      case -1: color = 'lightblue'; break;
      case  0: color = 'white'; break;
      case  1: color = 'salmon'; break;
    }
    switch (this.compRain(period)) {
      case -1: color = '#aaa'; break;
      case  0: break;
      case  1: color = 'gray'; break;
    }
    return color;
  }
}

class WeatherPeriod {
  idx: number;
  name: string;
  tempUnit: string;
  temp: number;
  hiWind: number;
  loWind: number;
  windString: string;
  isRainy: boolean;
  wasYesterdayRainy: boolean;
  shortForecast: string = '';
  isDaytime: boolean;
  
  constructor(pData) {
    this.idx = String(pData['number']);
    this.name = pData['name'];
    this.temp = parseFloat(pData['temperature']);
    this.windString = pData['windSpeed'];
    let winds = this.windString
      .replace('mph', '')
      .split(' to ');
    this.loWind = parseFloat(winds[0]);
    this.hiWind = winds.length < 2 ? this.loWind : parseFloat(winds[1]);
    this.shortForecast = pData['shortForecast'];
    this.tempUnit = pData['temperatureUnit'];
    let lfc = this.shortForecast.toLowerCase();
    this.isRainy = lfc.includes('shower') ||
      lfc.includes('rain') ||
      lfc.includes('storm');
    this.isDaytime = pData['isDaytime'];
  }
  
  getDisplayString() {
    return `${this.name}, ${this.temp}\u00B0${this.tempUnit}, ` +
      `${this.loWind}` +
      `${this.hiWind === this.loWind ? '' : ' to ' + this.hiWind}` +
      `\n${this.shortForecast}`;
  }
}