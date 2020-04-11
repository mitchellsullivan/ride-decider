import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View,
  Button, Alert,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

import GetLocation from 'react-native-get-location';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  button: {
    marginBottom: 8,
  }
});

export default class App extends Component {
  
  state = {
    tempRead: null,
    loading: false,
  }
  
  _requestLocation = () => {
    this.setState({ loading: true, location: null });
    
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 150000,
    })
      .then(location => {
        let long = location['longitude'].toFixed(2);
        let lat = location['latitude'].toFixed(2);
        let url = `https://api.weather.gov/points/${lat},${long}`;
        axios.get(url).then(data => {
          let forecastUrl = data['data']['properties']['forecast'];
          axios.get(forecastUrl).then(dataFc => {
            this.setState({
              tempRead: dataFc['data']['properties']['periods'],
              loading: false,
            });
          })
        })
      })
      .catch(ex => {
        const { code, message } = ex;
        console.warn(code, message);
        if (code === 'CANCELLED') {
          Alert.alert('Location cancelled by user or by another request');
        }
        if (code === 'UNAVAILABLE') {
          Alert.alert('Location service is disabled or unavailable');
        }
        if (code === 'TIMEOUT') {
          Alert.alert('Location request timed out');
        }
        if (code === 'UNAUTHORIZED') {
          Alert.alert('Authorization denied');
        }
        this.setState({
          location: null,
          loading: false,
        });
      });
  }
  
  render() {
    const { tempRead, loading } = this.state;
    return (
      <View style={styles.container}>
        {/*<Text style={styles.welcome}>Welcome to React Native!</Text>*/}
        {/*<Text style={styles.instructions}>To get 7 days temps, press the button:</Text>*/}
        <View style={styles.button}>
          <Button
            disabled={loading}
            title="Get Temperatures"
            onPress={this._requestLocation}
          />
        </View>
        {loading ? (
          <ActivityIndicator />
        ) : null}
        {tempRead ? (
          tempRead.map((p, i, a) => {
            return (
              <View key={i}>
              <Text style={styles.location}>
                {`${p['name']} ${p['temperature']}`}
              </Text>
            </View>)
          })
        ) : null}
        {/*<Text style={styles.instructions}>Extra functions:</Text>*/}
      </View>
    );
  }
}