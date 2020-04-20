import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView, StatusBar
} from 'react-native';

import {styles} from '../Styles';
import {DayRow} from '../DayRow';
import {withGlobalContext} from '../GlobalContext';
import {ThumbButton} from "../ThumbButton";
import {LikeStatus} from "../models";
import Icon from 'react-native-vector-icons/Feather';

class HomeScreen extends React.Component<any> {
  static navigationOptions = ({navigation}: any) => {
    return {
      title: 'Home',
    }
  }

  async componentDidMount(): Promise<void> {
    await this.props.global.appInit();
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
        const today = periods[0];
      const shortFcLen = today.shortForecast.length;
      let shortFcSize = shortFcLen > 16 ? 16 : 20;
      return (
          <>
            {/*<Text style={{fontSize: 16}}>{periods[0].date}</Text>*/}
            <Text style={{fontSize: 20, color: 'white'}}>{today.name}</Text>
            <Text style={{fontSize: 30, color: 'white'}}>{today.temp}{'\u00b0'}{'F'}</Text>
            <Text style={{fontSize: 20, color: 'white'}}>{today.windString}</Text>
            <Text style={{fontSize: shortFcSize, color: 'white', paddingTop: 0, textAlign: 'center'}}>
              {today.shortForecast}
            </Text>
          </>
      )
    }
  }

  render() {
    const {
      safeAreaInsets,
      periods,
      criteriaList,
      thumbPress
    } = this.props.global;
    let currentLike = periods.length > 0 ?
        periods[0].likedStatus : LikeStatus.NEUTRAL;
    return (
      <SafeAreaView style={[styles.container, {flex: 1}]}>
        {this.renderHeading()}

        {/*TODAY'S WEATHER*/}
        <View style={[{flex: 0.25, flexDirection: 'row', width: '100%'}]}>
          <View style={[{
            borderWidth: 0,
            paddingTop: 10,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }]}>
            {this.renderToday()}
          </View>
          <View style={[{
            borderWidth: 0,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }]}>
              <Text style={{color: 'limegreen', fontSize: 42, padding: 10}}>
                  GOOD
              </Text>
              {/*LIKE BUTTONS*/}
              <View style={{alignItems: 'center', justifyContent: 'center',padding: 10}}>
                  <View style={{
                      flexDirection: 'row',
                      backgroundColor: 'transparent'}}>
                      <View>
                          <ThumbButton onPress={thumbPress} which={LikeStatus.LIKED}
                                       curr={currentLike}/>
                      </View>
                      <View style={{width: 40}}/>
                      <View>
                          <ThumbButton onPress={thumbPress} which={LikeStatus.DISLIKED}
                                       curr={currentLike}/>
                      </View>
                  </View>
              </View>
          </View>
        </View>

        <View style={{flex: 0.05, borderBottomColor: 'gray'}}/>

        {!periods || periods.length === 0 ? (
            // EMPTY DAYS LIST
            <View style={
              {flex: 0.70, width: '100%'}}>
              <Text style={{textAlign: 'center', fontSize: 20, marginTop: 20,
                  color: 'white'}}>
                (No data.)
              </Text>
            </View>
        ) : (
            // FULL DAYS LIST
            <View style={
              [styles.listView, {
                flex: 0.75,
                justifyContent: 'center',
              }]}>
              <FlatList
                  style={styles.scroll}
                  data={periods.slice(1, 7)}
                  renderItem={({item}) => {
                    return <DayRow criteriaList={criteriaList}
                                   item={item}/>
                  }}
                  keyExtractor={({idx}) => idx}/>
            </View>
        )}
      </SafeAreaView>
    )
  }
}

export default withGlobalContext(HomeScreen);