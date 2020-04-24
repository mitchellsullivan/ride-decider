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

import {styles} from '../Styles';
import {DayRow} from '../DayRow';
import {withGlobalContext} from '../GlobalContext';
import {ThumbButton} from "../ThumbButton";
import {Criteria, LikeStatus} from "../../types";

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
      city
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
        <View style={{flex: 1, alignItems: 'center'}}>
          {loading ? (<ActivityIndicator style={ss.spinner}/>) :
            (<Text style={{color: 'lightgray', }}>{city}</Text>)}
        </View>
      </View>
    )
  }

  renderToday = () => {
    let {periods} = this.props.global;
    if (periods.length == 0) return <View style={ss.topLeftArea}/>;
    const today = periods[0];
    let tomorrow = today.isTomorrow ? ' (Tomorrow)' : '';
    return (
      <View style={[ss.topLeftArea]}>
        <Text style={ss.dayText}>{today.name + tomorrow}</Text>
        <Text style={ss.temperatureText}>{today.temp}{'\u00b0'}{'F'}</Text>
        <Text style={ss.windText}>{today.windString}</Text>
        <Text style={ss.shortForecastText}>{today.xtrashortfc}</Text>
      </View>
    )
  }

  renderLikeButtons = () => {
    const {periods, onThumbButtonPress} = this.props.global;
    let currentLike = periods.length > 0 ?
      periods[0].likedStatus : LikeStatus.NEUTRAL;

    return (
      <View style={ss.likesColContainer}>
        <View style={ss.likesColView}>
          <View>
            <ThumbButton
              onPress={onThumbButtonPress}
              which={LikeStatus.LIKED}
              curr={currentLike}/>
          </View>
          <View style={{height: 10}}/>
          <View>
            <ThumbButton
              onPress={onThumbButtonPress}
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
      <View style={[styles.listView, {flex: 0.8}]}>
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

  renderTodayPrediction = () => {
    let {periods} = this.props.global;
    if (periods.length == 0) return (
      <View style={[ss.predictView, {paddingTop: -5, flex: 1}]}/>
    )

    const today = periods[0];
    return (
      <>
        <Text style={[ss.predictText, {paddingTop: 5, fontSize: 12}]}>Like Prediction %</Text>
        <View style={ss.predictView}>
          <View style={{flex: 1}}>
            <Text style={ss.predictText}>Temp:</Text>
            <Text style={ss.predictText}>Sky:</Text>
            <Text style={ss.predictText}>Wind: </Text>
          </View>
          <View style={{width: 5}}/>
          <View style={{flex: 1}}>
            <Text style={ss.predictText}>{today.prediction.tempRatingStr}</Text>
            <Text style={ss.predictText}>{today.prediction.skyRatingStr}</Text>
            <Text style={ss.predictText}>{today.prediction.windRatingStr}</Text>
          </View>
        </View>
      </>
    )
  }

  render() {
    let {periods, criteriaList} = this.props.global;
    let ready = periods.length > 0;
    let text = 'FAIL';
    if (ready) {
      for (let c of criteriaList) {
        if (c.passes(periods[0])){
          text = 'PASS'
        }
      }
    }
    return (
      <SafeAreaView style={[styles.container, {flex: 1}]}>
        {this.renderHeading()}
        <View style={[ss.topArea]}>
          {this.renderToday()}
          <View style={[ss.topRightArea]}>
            <View style={{flex: 1.2, flexDirection: 'column'}}>
              <View style={{flex: 3.25, padding: 0}}>
                {this.renderTodayPrediction()}
              </View>
              <View style={{flex: 1.1}}>
                <Text style={[ss.predictText, {paddingTop: 0, fontSize: 12}]}>
                  Whitelist Check
                </Text>
                <Text style={ss.ratingText}>{text}</Text>
              </View>
            </View>
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
    fontSize: 16,
    color: 'white',
  },
  temperatureText: {
    paddingTop: 3,
    fontSize: 24,
    color: 'white'
  },
  shortForecastText: {
    fontSize: 14,
    color: 'white',
    paddingTop: 2,
    textAlign: 'center'
  },
  windText: {fontSize: 14, color: 'white'},
  indication: {},
  topLeftArea: {
    // borderWidth: 1,
    // borderColor: 'white',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  topArea: {
    flex: 0.2,
    paddingTop: 15,
    paddingBottom: 0,
    flexDirection: 'row',
    width: '100%',
  },
  topRightArea: {
    // borderWidth: 1,
    // borderColor: 'gray',
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  ratingText: {
    color: 'limegreen',
    fontSize: 18,
    // paddingTop: 15
  },
  likesRowView: {
    flexDirection: 'row',
    backgroundColor: 'transparent'
  },
  likesColView: {
    // borderWidth: 1,
    // borderColor: 'gray',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  likesColContainer: {
    flex: 0.8,
    // borderWidth: 1,
    // borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noData: {
    textAlign: 'center',
    fontSize: 20,
    marginTop: 20,
    color: 'white'
  },
  predictText: {
    color: 'white',
    fontSize: 12,
  },
  predictView: {
    flex: 1,
    paddingTop: 0,
    // alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  }
})

export default withGlobalContext(HomeScreen);
