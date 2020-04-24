import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet
} from 'react-native'
import {styles} from './Styles'
import {
  Criteria,
  WeatherPeriod
} from "../types";

type DayRowProps = {
  item: WeatherPeriod,
  criteriaList: Array<Criteria>
}

export const DayRow = ({item}: DayRowProps) => {
  let shortDay = (item.name || '   ').substr(0, 3);
  let lastBorderWidth = item.idx === '14' || item.idx === '13' ? 0 : 0.25;

  const renderRatings = () => {
    return (
      <View style={ss.predictView}>
        <View style={{flex: 1}}>
          <Text style={ss.predictText}>Temp:</Text>
          <Text style={ss.predictText}>Sky:</Text>
          <Text style={ss.predictText}>Wind: </Text>
        </View>
        <View style={{flex: 1, marginLeft: 5}}>
          <Text style={ss.predictText}>{item.prediction.tempRatingStr}</Text>
          <Text style={ss.predictText}>{item.prediction.skyRatingStr}</Text>
          <Text style={ss.predictText}>{item.prediction.windRatingStr}</Text>
        </View>
      </View>
    )
  }

  return (
    <TouchableOpacity onPress={() => {}} style={{flex: 1}}>
      <View style={[styles.row, {borderBottomWidth: lastBorderWidth, paddingTop: 5}]}>
        <View style={{flex: 1}}>
            <Text style={{fontSize: 16, color: 'white'}}>{shortDay}</Text>
            <Text style={{fontSize: 22, color: 'white'}}>{item.temp}{'\u00b0'}{'F'}</Text>
        </View>
          <View style={{flex: 2}}>
              <Text style={{fontSize: 13, color: 'white', textAlign: 'left'}}>
                {item.xtrashortfc}
              </Text>
              <Text style={{fontSize: 13, color: 'white', paddingTop: 5, textAlign: 'left'}}>
                {item.windString} winds
              </Text>
          </View>
        {renderRatings()}
      </View>
    </TouchableOpacity>
  )
}


const ss = StyleSheet.create({
  predictText: {
    color: 'white',
    fontSize: 12,
    textAlign: 'left',
  },
  predictView: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
  }
})
