import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView
} from 'react-native';

import {styles} from '../Styles';
import {StarButton} from '../StarButton';
import {DayRow} from '../DayRow';
import {withGlobalContext} from '../GlobalContext';

class HomeScreen extends React.Component<any> {
  static navigationOptions = ({navigation}: any) => {
    return {
      title: 'Home',
    }
  }
  
  state = {
    starSet: -1
  }

  async componentDidMount(): Promise<void> {
    await this.props.global.appInit();
  }
  
  setStar = (idx: number) => {
    if (idx === this.state.starSet) {
      idx = -1;
    }
    this.props.global.onRate(idx);
    this.setState({
      starSet: idx
    })
  }
  
  renderHeading = () => {
    const {
      loading,
      requestLocation,
    } = this.props.global;
    
    return (
      <View style={[styles.headingView,]}>
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
            Weather
          </Text>
        </View>
        <View style={{flex: 1}}>
          {loading ?
            <ActivityIndicator style={
              {paddingBottom: 10, height: 40}}/> : null}
        </View>
      </View>
    )
  }
  
  renderToday = () => {
    let {periods} = this.props.global;
    if (periods.length > 0) {
      const shortFcLen = periods[0].shortForecast.length;
      let shortFcSize = shortFcLen > 16 ? 16 : 20;
      return (
        <>
          {/*<Text style={{fontSize: 16}}>{periods[0].date}</Text>*/}
          <Text style={{fontSize: 20}}>{periods[0].name}</Text>
          <Text style={{fontSize: 30}}>{periods[0].temp}{'\u00b0'}{'F'}</Text>
          <Text style={{fontSize: 20}}>{periods[0].windString}</Text>
          <Text style={{fontSize: shortFcSize, paddingTop: 0, textAlign: 'center'}}>
            {periods[0].shortForecast}
          </Text>
        </>
      )
    }
  }
  
  render() {
    const {navigate} = this.props.navigation
    const {
      periods,
      criteriaList
    } = this.props.global;
    const {starSet} = this.state;
    return (
      <SafeAreaView style={[styles.container]}>
        {this.renderHeading()}
        <View style={[{flex: 0.25, flexDirection: 'row', width: 350}]}>
          <View style={[{
            borderWidth: 0,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'}]}>
            {this.renderToday()}
          </View>
        </View>
        <View style={{flex: 0.10,
          borderWidth: 0,
          width: 350,
          alignItems: 'center',
          justifyContent: 'center'}}>
          {/*<Text style={{fontSize: 14, padding: 5}}>Rate Today:</Text>*/}
          <View style={{flexDirection: 'row'}}>
            {[0,1,2,3,4].map(n =>
              <StarButton onPress={this.setStar}
                          currIdx={starSet}
                          index={n}
                          key={n}/>)}
          </View>
        </View>
        {!periods || periods.length === 0 ? (
          <View style={
            {flex: 0.65, backgroundColor: 'lightgray', width: 350}}>
            <Text style={
              {textAlign: 'center', fontSize: 20, marginTop: 20}}>
              (No data.)
            </Text>
          </View>
        ) : (
          <View style={
            [styles.listView, {flex: 0.65, paddingTop: 10, justifyContent: 'center'}]}>
            <FlatList
              style={styles.scroll}
              data={periods.slice(1, 7)}
              renderItem={({item}) => {
                return <DayRow criteriaList={criteriaList}
                               item={item}/>
              }}
              keyExtractor={({name}) => name}
            />
          </View>
        )}
      </SafeAreaView>
    )
  }
}

export default withGlobalContext(HomeScreen);