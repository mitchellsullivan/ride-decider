import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';
import axios from 'axios';
import GetLocation from 'react-native-get-location';
import { byPoints, forecastJackson } from './data/forecast';

// const TEMPS = Array.from(new Array(251), (x,i) => i + -100)
const LOC_TEST = "32.36,-90.136"
const DEFAULT_LOC = {
  longitude : byPoints.data.geometry.coordinates[0],
  latitude : byPoints.data.geometry.coordinates[1]
}

export default class App extends Component {
  state = {
    periods: null,
    loading: false,
    seldHi: '72',
    seldLo: '60',
  }
  
  componentDidMount(): void {
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
        this.setState({
          periods,
          loading: false,
        });
      })
    })
  }
  
  _requestLocation = () => {
    this.setState({ loading: true, location: null, periods: [] });
    setTimeout(() => {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 5000,
      })
        .then(location => this.populate(location))
        .catch(ex => {
          const { code, message } = ex;
          // console.warn(code, message);
          // if (code === 'CANCELLED') {
          //   Alert.alert('Location cancelled by user or by another request');
          // }
          // if (code === 'UNAVAILABLE') {
          //   Alert.alert('Location service is disabled or unavailable');
          //   // console.log(byPoints);
          //
          // }
          // if (code === 'TIMEOUT') {
          //   Alert.alert('Location request timed out');
          // }
          // if (code === 'UNAUTHORIZED') {
          //   Alert.alert('Authorization denied');
          // }
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
      this.setState({
        seldHi: t
      })
    } else {
      this.setState({
        seldLo: t
      })
    }
  }
  
  renderItem(item) {
    // const color = item.good ? 'lightgreen' : '#fff';
    const temp = item['temperature'];
    const tooHot = temp > parseFloat(this.state.seldHi);
    const tooCold = temp < parseFloat(this.state.seldLo);
    const isGood = !tooHot && !tooCold;
    const color = isGood ? 'lightgreen' : tooHot ? 'salmon' : 'lightblue';
    return (
      <TouchableOpacity onPress={() => alert('yo')}>
        <View style={[styles.row, {backgroundColor: color}]}>
          <Text style={styles.textDeviceName}>
            {`${item['name']} - `}
            {`${temp} ${item['temperatureUnit']} - `}
            {`${item['windSpeed']} ${item['windDirection']} ... `}
            {`${isGood ? 'Y' : 'N'}`}
            {`\n${item['shortForecast']}`}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  render() {
    const { periods, loading, seldLo, seldHi } = this.state;
    let days = periods
    return (
      <KeyboardAvoidingView style={styles.container} behavior='padding'>
        <View style={styles.topSpace}/>
        <View style={[styles.headingView, {flexDirection: 'row'}]}>
          <View style={{flex: 0.33}}/>
          <View style={{flex: 0.33}}>
            <Text style={styles.headingText}>
              RiDecide
            </Text>
          </View>
          <View style={{flex: 0.33}}>
            {loading ? <ActivityIndicator/> : null}
          </View>
        </View>
        {!days || days.length === 0 ? (
          <View style={{flex: 0.7, backgroundColor: 'lightgray', width: 350}}>
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
              keyExtractor={item => item['number'].toString()}
            />
          </View>
        )}
        <View style={styles.buttView}>
          <TouchableOpacity onPress={this._requestLocation} disabled={loading}>
            <View style={styles.butt}>
              <Text style={styles.buttText}>Refresh</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.boxView}>
          <Text>  Lowest Temp / Highest Temp</Text>
          <View style={{flexDirection:"row"}}>
            <View style={{flex:1}}>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={Keyboard.dismiss}
                         onChangeText={(text) => this.onChangeTemp(text, 'lo')}
                         value={seldLo ? seldLo : ''}
                         style={[styles.tempBox, {justifyContent: 'flex-start'}]}
                         maxLength={3}/>
            </View>
            <View style={{flex:1}}>
              <TextInput keyboardType='numeric'
                         returnKeyLabel='Done'
                         returnKeyType='done'
                         onSubmitEditing={Keyboard.dismiss}
                         onChangeText={text => this.onChangeTemp(text, 'hi')}
                         value={seldHi ? seldHi : ''}
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
    padding: 10,
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
    height: 50,
    padding: 5,
  },
  buttText: {
    color: 'blue',
    fontSize: 20
  },
  buttView: {
    flex: 0.05,
    marginTop: 10,
    marginBottom: 10
  },
  boxView: {
    flex: 0.25,
    width: 300,
    marginTop: 10
    // borderWidth: 1,
  },
  listView: {
    flex: 0.7,
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
    height: 50,
    // borderRadius: 5,
    marginTop: 0,
    borderColor: 'gray',
    borderBottomWidth: 1,
    padding: 5,
  },
});