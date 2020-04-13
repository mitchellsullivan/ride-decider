import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  FlatList,
} from 'react-native'

import {DEFAULT_LOC, WeatherPeriod} from '../models'
import {styles} from '../../Styles'

export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Home',
    };
  };
  
  renderItem(item: WeatherPeriod) {
    const {criteriaList} = this.props.screenProps;
    // const color = curr.ratePeriodColor(item);
    let color = 'salmon';
    if (!criteriaList || criteriaList.length === 0) {
      color = 'lightgreen'
    } else {
      criteriaList.forEach((v,i,a) => {
        if (v.passes(item)) {
          color = 'lightgreen';
        } else {
          // alert(JSON.stringify(item));
        }
      });
    }
    return (
      <TouchableOpacity onPress={() => {}}>
        <View style={[styles.row, {backgroundColor: color}]}>
          <View style={{flex: 1}}>
            <Text>
              {item.getDisplayString()}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text>
              {/*{reasons}*/}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
  
  render() {
    const {navigate} = this.props.navigation;
    const { periods, loading, requestLocation } = this.props.screenProps;
    let days = periods
    return (
      <KeyboardAvoidingView style={styles.container}
                            behavior='padding'>
        <View style={styles.topSpace}/>
        <View style={[styles.headingView, {flexDirection: 'row', marginBottom: 5}]}>
          <View style={{flex: 1}}>
            <View style={styles.buttView}>
              <TouchableOpacity onPress={requestLocation} disabled={loading}>
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
      </KeyboardAvoidingView>
    );
  }
}
