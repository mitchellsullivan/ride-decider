import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView
} from 'react-native'

import {styles} from '../../Styles'
import {StarButton} from '../StarButton'
import {DayRow} from '../DayRow'

export default class HomeScreen extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Home',
    }
  }
  
  state = {
    starSet: -1
  }
  
  setStar = (idx) => {
    if (idx === this.state.starSet) {
      idx = -1;
    }
    this.props.screenProps.onRate(idx);
    this.setState({
      starSet: idx
    })
  }
  
  render() {
    const {navigate} = this.props.navigation
    const {
      periods,
      loading,
      requestLocation,
      criteriaList
    } = this.props.screenProps
    const {starSet} = this.state;
    return (
      <SafeAreaView style={[styles.container]}
                    behavior='padding'>
        <View style={[styles.headingView, {
          flexDirection: 'row',
          marginBottom: 5,
          flex: 0.05}]}>
          <View style={{flex: 1}}>
            <View style={styles.buttView}>
              <TouchableOpacity onPress={requestLocation}
                                disabled={loading}>
                <View style={styles.butt}>
                  <Text style={styles.buttText}>Refresh</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.headingText}>
              Ride Decider
            </Text>
          </View>
          <View style={{flex: 1}}>
            {loading ?
              <ActivityIndicator style={
                {paddingBottom: 10, height: 40}}/> : null}
          </View>
        </View>
        {!periods || periods.length === 0 ? (
          <View style={
            {flex: 0.80, backgroundColor: 'lightgray', width: 350}}>
            <Text style={
              {textAlign: 'center', fontSize: 20, marginTop: 20}}>
              (No data.)
            </Text>
          </View>
        ) : (
          <View style={
            [styles.listView, {flex: 0.80, paddingTop: 20}]}>
            <FlatList
              style={styles.scroll}
              data={periods}
              renderItem={({item}) => {
                return <DayRow criteriaList={criteriaList}
                               item={item}/>
              }}
              keyExtractor={item => item.idx}
            />
          </View>
        )}
        <View style={{flex: 0.15, paddingTop: 30}}>
          <View style={{flexDirection: 'row'}}>
            {[0,1,2,3,4].map(n =>
              <StarButton onPress={this.setStar}
                          currIdx={starSet}
                          index={n}/>)}
          </View>
        </View>
      </SafeAreaView>
    )
  }
}
