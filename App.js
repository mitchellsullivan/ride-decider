import React, {Component} from 'react'
import {
  ActivityIndicator,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import {AsyncStorage} from '@react-native-community/async-storage'
import axios from 'axios'
import GetLocation from 'react-native-get-location'
import {byPoints} from './data/forecast'

const DEFAULT_LOC = {
  longitude : byPoints.data.geometry.coordinates[0],
  latitude : byPoints.data.geometry.coordinates[1]
}

const DEFAULT_HI = '72';
const DEFAULT_LO = '60';

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
  
  constructor(pData) {
    this.idx = String(pData['number']);
    this.name = pData['name'];
    this.temp = parseFloat(pData['temperature']);
    this.windString = pData['windSpeed'];
    let winds = this.windString.replace('mph', '')
      .split(' to ');
    this.loWind = parseFloat(winds[0]);
    this.hiWind = winds.length < 2 ? this.loWind : parseFloat(winds[1]);
    this.shortForecast = pData['shortForecast'];
    this.tempUnit = pData['temperatureUnit'];
    let lfc = this.shortForecast.toLowerCase();
    this.isRainy = lfc.includes('shower') ||
      lfc.includes('rain') ||
      lfc.includes('storm');
  }
  
  getDisplayString() {
    return `${this.name}, ${this.temp}\u00B0${this.tempUnit}, ` +
      `${this.loWind}` +
      `${this.hiWind === this.loWind ? '' : ' to ' + this.hiWind}` +
      `\n${this.shortForecast}`;
  }
}

class Criterium {
  maxGoodTemp: number = parseFloat(DEFAULT_HI);
  minGoodTemp: number = parseFloat(DEFAULT_LO);
  
  constructor(minGoodTemp, maxGoodTemp) {
    this.maxGoodTemp = parseFloat(maxGoodTemp);
    this.minGoodTemp = parseFloat(minGoodTemp);
  }
  
  isMet(period: WeatherPeriod) {
    return this.isTempOkay(period.temp);
  }
  
  getTempRating(period: WeatherPeriod): number {
    const tooHot = period.temp > this.maxGoodTemp;
    const tooCold = period.temp < this.minGoodTemp;
    if (!tooHot && !tooCold) {
      return 0;
    } if (tooHot) {
      return 1;
    } else {
      return -1;
    }
  }
}

export default class App extends Component {
  state = {
    periods: [],
    loading: false,
    criteria: new Criterium(DEFAULT_LO, DEFAULT_HI)
  }
  
  async componentDidMount(): void {
    await this._retrieveTempRange();
    this._requestLocation();
  }
  
  populate = (location) => {
    location = location || DEFAULT_LOC;
    let long = (location['longitude'] || 0).toFixed(1);
    let lat = (location['latitude'] || 0).toFixed(1);
    let url = `https://api.weather.gov/points/${lat},${long}`;
    console.log(url);
    axios.get(url).then(data => {
      let forecastUrl = data['data']['properties']['forecast'];
      axios.get(forecastUrl).then(dataFc => {
        let periods = dataFc['data']['properties']['periods'];
        periods = periods.filter(p => !p['name'].toLowerCase().endsWith('night'));
        periods = periods.map(p => new WeatherPeriod(p));
        this.setState({
          periods,
          loading: false,
        });
      })
    })
  }
  
  _requestLocation = () => {
    this.setState({
      loading: true,
      location: null,
      periods: []
    });
    setTimeout(() => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 5000,
      })
        .then(location => this.populate(location))
        .catch(ex => {
          const { code, message } = ex;
          location = DEFAULT_LOC;
          this.populate(location);
          this.setState({
            location,
            loading: false,
          });
        });
    }, 500);
  }
  
  onChangeTemp = (t, which) => {
    if (which === 'hi') {
      let criteria = this.state.criteria;
      criteria.maxGoodTemp = t;
      this.setState({
        criteria
      })
    } else {
      let criteria = this.state.criteria;
      criteria.minGoodTemp = t;
      this.setState({
        criteria
      })
    }
  }
  
  _retrieveTempRange = async () => {
    try {
      let lo = await AsyncStorage.getItem('lo') || DEFAULT_LO;
      let hi = await AsyncStorage.getItem('hi') || DEFAULT_HI;
      let criteria = new Criterium(lo, hi);
      this.setState({
        criteria
      })
    } catch (error) {
    
    }
  }
  
  _saveTempRange = async () => {
    try {
      await AsyncStorage.setItem('lo', this.state.criteria.minGoodTemp);
      await AsyncStorage.setItem('hi', this.state.criteria.maxGoodTemp);
    } catch (error) {
      // Error saving data
    }
  };
  
  renderItem(item: WeatherPeriod) {
    const rate = this.state.criteria.getTempRating(item);
    let color = 'white'
    switch (rate) {
      case -1: color = 'lightblue'; break;
      case  0: color = 'lightgreen'; break;
      case  1: color = 'salmon'; break;
    }
    // const color = isGood ? 'lightgreen' : tooHot ? 'salmon' : 'lightblue';
    return (
      <TouchableOpacity onPress={() => alert(item.name)}>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={styles.textDeviceName}>
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
        <View style={[styles.headingView, {flexDirection: 'row'}]}>
          <View style={{flex: 0.33}}>
            <View style={styles.buttView}>
              <TouchableOpacity onPress={this._requestLocation} disabled={loading}>
                <View style={styles.butt}>
                  <Text style={styles.buttText}>Refresh</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 0.33}}>
            <Text style={styles.headingText}>
              RiDecide
            </Text>
          </View>
          <View style={{flex: 0.33}}>
            {loading ?
              <ActivityIndicator style={{paddingBottom: 10, height: 40}}/> : null}
          </View>
        </View>
        {!days || days.length === 0 ? (
          <View style={{flex: 0.75, backgroundColor: 'lightgray', width: 350}}>
            <Text style={{textAlign: 'center', fontSize: 20, marginTop: 30}}>
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
            <View style={{flex: 1}}>
              <Text>Lo Good Temp (F)</Text>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={async () => {
                           Keyboard.dismiss();
                           await this._saveTempRange();
                         }}
                         onChangeText={(text) => this.onChangeTemp(text, 'lo')}
                         value={String(criteria.minGoodTemp)}
                         style={[styles.tempBox, {justifyContent: 'flex-start'}]}
                         maxLength={3}/>
            </View>
            <View style={{flex: 1}}>
              <Text>Hi Good Temp (F)</Text>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={async () => {
                           Keyboard.dismiss();
                           await this._saveTempRange();
                         }}
                         onChangeText={text => this.onChangeTemp(text, 'hi')}
                         value={String(criteria.maxGoodTemp)}
                         style={[styles.tempBox, {justifyContent: 'flex-end'}]}
                         maxLength={3}/>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  topSpace: {
    marginTop: 40,
  },
  headingView: {
    paddingTop: 10,
  },
  headingText: {
    fontSize: 28,
    textAlign: 'center'
  },
  tempBox: {
    width: 90,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightgray',
    height: 50,
    padding: 5,
    margin: 5,
    fontSize: 24,
    textAlign: 'center',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  location: {
    color: '#333333',
    marginBottom: 5,
  },
  // button: {
  //   marginBottom: 8,
  //   flex: 0.25
  // },
  butt: {
    height: 40,
    paddingTop: 10,
    paddingRight: 10
    // borderWidth: 1,
  },
  buttText: {
    color: 'blue',
    fontSize: 18,
    textAlign: 'center'
  },
  buttView: {
    // backgroundColor: 'lightgray',
  },
  boxView: {
    flex: 0.25,
    width: 300,
    marginTop: 10
    // borderWidth: 1,
  },
  listView: {
    flex: 0.75,
    width: 350
  },
  scroll: {
    backgroundColor: 'lightgray',
    // margin: 10,
    // marginTop: 10,
    // borderWidth: 1,
    // borderRadius: 10,
    borderColor: 'lightgray',
    // borderWidth: 1
  },
  row: {
    height: 60,
    // borderRadius: 5,
    marginTop: 0,
    borderColor: 'gray',
    borderBottomWidth: 1,
    padding: 5,
  },
});