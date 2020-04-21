import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet
} from 'react-native';

import {styles} from '../styles';
import {DayRow} from '../DayRow';
import {withGlobalContext} from '../GlobalContext';
import {ThumbButton} from "../ThumbButton";
import {LikeStatus} from "../models";

class HomeScreen extends Component<any> {
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
          <View style={ss.buttView}>
            <TouchableOpacity onPress={requestLocation} disabled={loading}>
              <View style={ss.butt}>
                <Text style={ss.buttText}>Refresh</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.headingText}>Weather</Text>
        </View>
        <View style={{flex: 1}}>
          {loading ? <ActivityIndicator style={ss.spinner}/> : null}
        </View>
      </View>
    )
  }

  renderToday = () => {
    let {periods} = this.props.global;
    if (periods.length > 0) {
      const today = periods[0];
      return (
        <View style={[ss.todayView]}>
          <Text style={ss.dayText}>{today.name}</Text>
          <Text style={ss.temperatureText}>{today.temp}{'\u00b0'}{'F'}</Text>
          <Text style={ss.windText}>{today.windString}</Text>
          <Text style={ss.shortForecastText}>
            {today.shortForecast}
          </Text>
        </View>
      )
    }
  }

  renderLikeButtons = () => {
    const {periods, thumbPress} = this.props.global;
    let currentLike = periods.length > 0 ?
      periods[0].likedStatus : LikeStatus.NEUTRAL;

    return (
      <View style={ss.likeContainer}>
        <View style={ss.likesRowView}>
          <View>
            <ThumbButton
              onPress={thumbPress}
              which={LikeStatus.LIKED}
              curr={currentLike}/>
          </View>
          <View style={{width: 40}}/>
          <View>
            <ThumbButton
              onPress={thumbPress}
              which={LikeStatus.DISLIKED}
              curr={currentLike}/>
          </View>
        </View>
      </View>
    )
  }

  renderDays = () => {
    const {periods, criteriaList} = this.props.global;
    const hasNoData = !periods || periods.length === 0;
    return hasNoData ? (
      <View style={{flex: 0.75, width: '100%'}}>
        <Text style={ss.noData}>(No data.)</Text>
      </View>
    ) : (
      <View style={[styles.listView, {flex: 0.75}]}>
        <FlatList
          style={[styles.scroll]}
          data={periods.slice(1, 7)}
          renderItem={({item}) => (
            <DayRow criteriaList={criteriaList} item={item}/>
          )}
          keyExtractor={({idx}) => idx}
        />
      </View>
    )
  }

  render() {
    return (
      <SafeAreaView style={[styles.container, {flex: 1}]}>
        {this.renderHeading()}
        <View style={[ss.topArea]}>
          {this.renderToday()}
          <View style={[ss.likeButtons]}>
            <Text style={ss.ratingText}>GOOD</Text>
            {this.renderLikeButtons()}
          </View>
        </View>
        <View style={{flex: 0.05, borderBottomColor: 'gray'}}/>
        {this.renderDays()}
      </SafeAreaView>
    )
  }
}

const ss = StyleSheet.create({
  spinner: {
    paddingBottom: 10,
    height: 40
  },
  butt: {
    paddingTop: 0,
    paddingRight: 10,
    paddingLeft: 10
  },
  buttText: {
    color: 'cyan',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: "500"
  },
  buttView: {},
  dayText: {
    fontSize: 20,
    color: 'white'
  },
  temperatureText: {
    fontSize: 30,
    color: 'white'
  },
  shortForecastText: {
    fontSize: 18,
    color: 'white',
    paddingTop: 0,
    textAlign: 'center'
  },
  windText: {fontSize: 20, color: 'white'},
  indication: {},
  todayView: {
    borderWidth: 0,
    paddingTop: 10,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topArea: {
    flex: 0.25,
    flexDirection: 'row',
    width: '100%'
  },
  likeButtons: {
    borderWidth: 0,
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingText: {
    color: 'limegreen',
    fontSize: 42,
    padding: 10
  },
  likesRowView: {
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  likeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  noData: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    color: 'white'
  },
})

export default withGlobalContext(HomeScreen);
